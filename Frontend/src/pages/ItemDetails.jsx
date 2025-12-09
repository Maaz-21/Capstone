import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import LoadingSpinner from '../components/LoadingSpinner';
import RatingStars from '../components/RatingStars';
import SimilarRecommendations from '../components/SimilarRecommendations';
import AuthContext from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';

export default function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similar, setSimilar] = useState([]);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadItem();
    if (user) {
      checkWatchlistStatus();
    }
  }, [id, user]);

  const loadItem = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/items/${id}`);
      setItem(res.data);
      
      // Also add to recent history when viewing details
      if (user) {
        await axios.post('/users/recent', { itemId: id });
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load item');
    } finally {
      setLoading(false);
    }
  };

  const checkWatchlistStatus = async () => {
    try {
      const res = await axios.get('/users/watchlist');
      // Check if current item ID is in the returned list
      const found = res.data.some(i => (i.itemId === id || i._id === id));
      setIsInWatchlist(found);
    } catch (err) {
      console.error("Failed to check watchlist status", err);
    }
  };

  const toggleWatchlist = async () => {
    if (!user) {
      showToast('Please login to use watchlist', 'info');
      return;
    }

    try {
      if (isInWatchlist) {
        await axios.delete(`/users/watchlist/${id}`);
        setIsInWatchlist(false);
        showToast('Removed from Watchlist', 'success');
      } else {
        await axios.post('/users/watchlist', { itemId: id });
        setIsInWatchlist(true);
        showToast('Added to Watchlist', 'success');
      }
    } catch (err) {
      showToast('Failed to update watchlist', 'error');
    }
  };

  const rateItem = async (value) => {
    if (!user) {
      showToast('Please login to rate items', 'info');
      return;
    }
    try {
      const res = await axios.post(`/items/${id}/rate`, { rating: value });
      showToast('Thanks for rating!', 'success');
      
      // Update local state with new rating info
      if (res.data.item) {
        setItem(prev => ({
          ...prev,
          rating: res.data.item.rating,
          ratingCount: res.data.item.ratingCount
        }));
      }
    } catch (err) {
      showToast('Failed to submit rating', 'error');
    }
  };

  const getSimilar = async () => {
    try {
      const res = await axios.post('/model/recommend', { item_id: id, n: 6 });
      setSimilar(res.data || []);
      // Scroll to bottom to see recommendations
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } catch (err) {
      showToast('Failed to get recommendations', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Container className="py-20 text-center"><Typography color="error">{error}</Typography></Container>;
  if (!item) return null;

  return (
    <Container maxWidth="lg" className="py-12 text-white">
      <Grid container spacing={6}>
        {/* Left: Image */}
        <Grid item xs={12} md={4}>
          <motion_img 
            src={item.posterURL || item.imageUrl || "https://via.placeholder.com/300x450?text=No+Image"} 
            alt={item.title}
            className="w-full rounded-lg shadow-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          />
        </Grid>

        {/* Right: Details */}
        <Grid item xs={12} md={8} className="space-y-6">
          <Typography variant="h3" className="font-bold">{item.title}</Typography>
          
          <div className="flex items-center gap-4">
            <RatingStars value={item.rating || 0} readOnly />
            <Typography className="text-gray-400">({item.ratingCount || 0} ratings)</Typography>
          </div>

          <div className="flex gap-2 flex-wrap">
            {item.genres && item.genres.map(g => (
              <span key={g} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-blue-300 border border-blue-900">
                {g}
              </span>
            ))}
          </div>

          <Typography className="text-gray-300 text-lg leading-relaxed">
            {item.description || "No description available."}
          </Typography>

          <div className="flex gap-4 pt-4">
            <Button 
              variant={isInWatchlist ? "outlined" : "contained"}
              color={isInWatchlist ? "inherit" : "primary"}
              startIcon={isInWatchlist ? <CheckIcon /> : <AddIcon />}
              onClick={toggleWatchlist}
              size="large"
            >
              {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
            </Button>
            
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={getSimilar}
              size="large"
            >
              Find Similar
            </Button>
          </div>

          {/* Rating Section */}
          <Box className="mt-8 p-6 bg-gray-900 rounded-xl border border-gray-800">
            <Typography variant="h6" className="mb-2">Rate this movie</Typography>
            <RatingStars onChange={rateItem} />
          </Box>
        </Grid>
      </Grid>

      {/* Similar Items Section */}
      {similar.length > 0 && (
        <div className="mt-16">
          <Typography variant="h4" className="font-bold mb-6">You Might Also Like</Typography>
          <SimilarRecommendations items={similar} />
        </div>
      )}
    </Container>
  );
}

// Helper for animation
const motion_img = (props) => {
  const { motion } = require('framer-motion');
  return <motion.img {...props} />;
};
