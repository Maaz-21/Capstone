import mongoose from 'mongoose';
import Item from '../models/Item.js';

export const getAllItems = async (req, res) => {
  const { genre } = req.query;
  try {
    let query = {};
    if (genre) {
      // Case-insensitive search for genre in the genres array
      query.genres = { $regex: new RegExp(genre, 'i') };
    }
    const items = await Item.find(query).limit(50).lean(); // Limit to 50 to prevent massive payloads
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTrendingItems = async (req, res) => {
  try {
    // Sort by popularityScore descending, fallback to vote_count or rating if needed
    // Returning top 20
    const items = await Item.find({})
      .sort({ popularityScore: -1 })
      .limit(20)
      .select('itemId title posterURL genres popularityScore')
      .lean();
      
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
       query = { $or: [{ _id: id }, { itemId: id }] };
    } else {
       query = { itemId: id };
    }

    const item = await Item.findOne(query).lean();
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const searchItems = async (req, res) => {
  const { q } = req.query;
  try {
    const items = await Item.find(q ? { title: new RegExp(q, 'i') } : {}).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rateItem = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  // Robust ID handling: check if it's a string or number in DB
  // Assuming itemId is String in schema based on previous fixes
  const iid = String(id); 

  try {
    // 1. Update Item Rating
    const item = await Item.findOne({ itemId: iid });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    if (typeof rating === 'number') {
      item.ratings = item.ratings || [];
      item.ratings.push(rating);
      // Recalculate average
      const sum = item.ratings.reduce((a,b) => a+b, 0);
      item.rating = sum / item.ratings.length;
      item.ratingCount = item.ratings.length; // Ensure this field exists/updates
      await item.save();
    }

    // 2. Update User Rating & History
    if (req.user) {
      // Use atomic updates for safety
      const user = await (await import('../models/User.js')).default.findById(req.user._id);
      
      // Update ratedItems
      const existingIndex = user.ratedItems.findIndex(r => String(r.itemId) === iid);
      if (existingIndex > -1) {
        user.ratedItems[existingIndex].rating = rating;
      } else {
        user.ratedItems.push({ itemId: iid, rating });
      }

      // Add to recentlyViewed (move to front)
      user.recentlyViewed = user.recentlyViewed.filter(rid => String(rid) !== iid);
      user.recentlyViewed.unshift(iid);
      if (user.recentlyViewed.length > 20) user.recentlyViewed.pop();

      await user.save();
      
      // Return both item and updated user data if needed, but standard is item
      // We can return a composite object
      res.json({ item, userRatedItems: user.ratedItems });
    } else {
      res.json({ item });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
