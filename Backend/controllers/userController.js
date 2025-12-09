import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper: Sign Access Token (Short-lived: 15m)
const signAccessToken = (user) => {
  const secret = process.env.JWT_SECRET || 'dev-secret';
  return jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '15m' });
};

// Helper: Sign Refresh Token (Long-lived: 7d)
const signRefreshToken = (user) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
  return jwt.sign({ id: user._id }, refreshSecret, { expiresIn: '7d' });
};

// Helper: Send Auth Response (Cookie + JSON)
const sendAuthResponse = (res, user, statusCode = 200) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  // Save refresh token to DB for rotation/invalidation support
  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false }); 

  // Send Refresh Token in HttpOnly Cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax', 
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  // Send Access Token & User Info in JSON
  res.status(statusCode).json({
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      watchlist: user.watchlist,
      recentlyViewed: user.recentlyViewed,
      ratedItems: user.ratedItems
    }
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    sendAuthResponse(res, user, 201);
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    sendAuthResponse(res, user);
  } catch (err) {
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
};

// @desc    Refresh Access Token
// @route   POST /api/users/refresh
export const refreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  const refreshToken = cookies.refreshToken;

  try {
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
    const decoded = jwt.verify(refreshToken, refreshSecret);
    
    // Find user and check if refresh token matches DB (Rotation check)
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      // Token reuse detected or invalid token -> Clear cookie
      res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Token is valid -> Rotate it (Issue new pair)
    sendAuthResponse(res, user);

  } catch (err) {
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    return res.status(403).json({ message: 'Expired or invalid refresh token' });
  }
};

// @desc    Logout user
// @route   POST /api/users/logout
export const logoutUser = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(204); // No content

  const refreshToken = cookies.refreshToken;

  try {
    // Is refreshToken in DB?
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = '';
      await user.save({ validateBeforeSave: false });
    }
    
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- Watchlist Controllers ---

export const addToWatchlist = async (req, res) => {
  const { itemId } = req.body;
  
  if (!itemId) return res.status(400).json({ message: 'Invalid Item ID' });

  try {
    const user = await User.findById(req.user._id);
    const strId = String(itemId);
    
    // Robust check: Compare as strings to avoid type mismatches
    const exists = user.watchlist.some(id => String(id) === strId);
    
    if (!exists) {
      user.watchlist.push(strId);
      await user.save();
    }
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromWatchlist = async (req, res) => {
  const { itemId } = req.params;

  if (!itemId) return res.status(400).json({ message: 'Invalid Item ID' });

  try {
    const user = await User.findById(req.user._id);
    
    // Filter out the item, ensuring string comparison
    const newWatchlist = user.watchlist.filter(id => String(id) !== String(itemId));
    
    // Only save if changes were made
    if (newWatchlist.length !== user.watchlist.length) {
      user.watchlist = newWatchlist;
      user.markModified('watchlist'); // Explicitly mark as modified to ensure save
      await user.save();
    }
    
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const Item = (await import('../models/Item.js')).default;
    const items = await Item.find({ itemId: { $in: user.watchlist } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Recently Viewed Controller ---

export const addToRecent = async (req, res) => {
  const { itemId } = req.body;
  // Ensure itemId is treated as a string to match schema
  const iid = String(itemId);

  if (!iid) return res.status(400).json({ message: 'Invalid Item ID' });

  try {
    // Use atomic updates to avoid VersionError
    // 1. Remove if exists (to move to top)
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { recentlyViewed: iid } }
    );

    // 2. Add to top and limit to 20
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $push: { 
          recentlyViewed: { 
            $each: [iid], 
            $position: 0, 
            $slice: 20 
          } 
        } 
      },
      { new: true }
    ).select('recentlyViewed');

    res.json(updatedUser.recentlyViewed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromRecent = async (req, res) => {
  const { itemId } = req.params;
  const iid = String(itemId);

  if (!iid) return res.status(400).json({ message: 'Invalid Item ID' });

  try {
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { recentlyViewed: iid } }
    );
    const user = await User.findById(req.user._id);
    res.json(user.recentlyViewed);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRecentlyViewed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const Item = (await import('../models/Item.js')).default;
    const items = await Item.find({ itemId: { $in: user.recentlyViewed } });
    
    // Sort by order in recentlyViewed array
    const sortedItems = user.recentlyViewed
      .map(id => items.find(item => item.itemId === id))
      .filter(item => item !== undefined);

    res.json(sortedItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRecentInterests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Combine recentlyViewed, watchlist, and ratedItems
    const interestIds = new Set([
      ...user.recentlyViewed,
      ...user.watchlist,
      ...user.ratedItems.map(r => r.itemId)
    ]);

    const idsArray = Array.from(interestIds).slice(0, 20);

    const Item = (await import('../models/Item.js')).default;
    const items = await Item.find({ itemId: { $in: idsArray } });
    
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
