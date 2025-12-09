import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { motion } from 'framer-motion';

// Small reusable card for a recommended item
export default function RecommendationCard({ item, onView, onFavorite }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }}>
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
      {item.imageURL && (
        <CardMedia component="img" height="160" image={item.imageURL} alt={item.title} />
      )}
      <CardContent>
        <Typography variant="subtitle1" component="div" sx={{ fontWeight: 700 }} className="truncate">
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mt-1 muted">
          {item.category} • ⭐ {item.rating ?? 'N/A'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onView(item)}>View</Button>
        <Button size="small" onClick={() => onFavorite(item)}>Favorite</Button>
      </CardActions>
      </Card>
    </motion.div>
  );
}
