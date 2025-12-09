import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  refreshToken, 
  logoutUser,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  addToRecent,
  removeFromRecent,
  getRecentInterests,
  getRecentlyViewed
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth Routes (Public)
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);

// User Routes (Protected)
router.get('/profile', verifyToken, getUserProfile);

// Watchlist
router.get('/watchlist', verifyToken, getWatchlist);          // GET /api/users/watchlist
router.post('/watchlist', verifyToken, addToWatchlist);       // POST /api/users/watchlist { itemId }
router.delete('/watchlist/:itemId', verifyToken, removeFromWatchlist); // DELETE /api/users/watchlist/:itemId

// Recent & Interests
router.get('/recent', verifyToken, getRecentlyViewed);        // GET /api/users/recent (History only)
router.post('/recent', verifyToken, addToRecent);             // POST /api/users/recent { itemId }
router.delete('/recent/:itemId', verifyToken, removeFromRecent); // DELETE /api/users/recent/:itemId
router.get('/interests', verifyToken, getRecentInterests);    // GET /api/users/interests (Combined)

export default router;
