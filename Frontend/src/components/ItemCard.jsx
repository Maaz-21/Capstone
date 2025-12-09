import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';

export default function ItemCard({ item, onView, onFavorite, isFavorite, onRemove }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} className="h-full relative group">
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 2, bgcolor: '#1e1e1e', color: 'white', position: 'relative' }}>
      
      {onRemove && (
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item);
            }}
            className="bg-black/50 hover:bg-red-600 text-white"
            sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'error.main' } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      )}

      {(item.posterURL || item.imageURL) && (
        <CardMedia component="img" height="160" image={item.posterURL || item.imageURL} alt={item.title} className="h-40 object-cover" />
      )}
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }} className="truncate text-white">{item.title}</Typography>
        <Typography variant="body2" className="text-gray-400">{item.category}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }} className="text-sm text-gray-500 line-clamp-3">{item.description}</Typography>
      </CardContent>
      <CardActions className="justify-between px-4 pb-4">
        <Button size="small" variant="outlined" color="primary" onClick={() => onView(item)}>View</Button>
        <Button 
          size="small" 
          variant={isFavorite ? "contained" : "text"} 
          color={isFavorite ? "success" : "primary"}
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(item);
          }}
        >
          {isFavorite ? "In Watchlist" : "Watchlist"}
        </Button>
      </CardActions>
      </Card>
    </motion.div>
  );
}
