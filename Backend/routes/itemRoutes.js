import express from 'express';
import { getAllItems, getItemById, searchItems, rateItem, getTrendingItems } from '../controllers/itemController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllItems);
router.get('/trending', getTrendingItems);
router.get('/search', searchItems);
router.get('/:id', getItemById);
router.post('/:id/rate', verifyToken, rateItem);

export default router;
