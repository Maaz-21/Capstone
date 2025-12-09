import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true }, // Corresponds to movieId from CSV
  title: { type: String, required: true },
  genres: [{ type: String }], // Array of strings for genres
  posterURL: { type: String },
  overview: { type: String },
  tmdbId: { type: String },
  releaseDate: { type: String },
  popularityScore: { type: Number, default: 0 },
  
  // Keeping these for backward compatibility or future use if needed
  rating: { type: Number, default: 0 },
  ratings: [{ type: Number }],
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);
export default Item;
