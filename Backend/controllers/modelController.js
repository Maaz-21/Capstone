import Item from '../models/Item.js';

// For now, implement a simple mock recommend endpoint.
// If you have a ColaRec service, replace the logic to call that service.
export const getRecommendations = async (req, res) => {
  const { user_id, item_id, n = 10, sample } = req.body || {};
  try {
    if (sample) {
      const items = await Item.find({}).limit(n).lean();
      return res.json(items);
    }

    // If item_id is provided, return items from same category
    if (item_id) {
      const item = await Item.findOne({ $or: [{ _id: item_id }, { itemId: item_id }] }).lean();
      if (!item) return res.status(404).json({ message: 'Item not found' });
      const recs = await Item.find({ category: item.category, _id: { $ne: item._id } }).limit(n).lean();
      return res.json(recs);
    }

    // If user_id provided, mock personalization by returning top-rated items
    if (user_id) {
      const recs = await Item.find({}).sort({ rating: -1 }).limit(n).lean();
      return res.json(recs);
    }

    // default fallback
    const items = await Item.find({}).limit(n).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
