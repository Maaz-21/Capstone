import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Grid, Skeleton, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import Footer from '../components/Footer';

export default function Favorites() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (user) {
        try {
          const res = await axios.get('/users/watchlist');
          setWatchlist(res.data);
        } catch (err) {
          console.error("Error fetching watchlist:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [user]);

  const handleToggleWatchlist = async (item) => {
    if (!user) return;
    const itemId = item.itemId || item._id;
    
    // Optimistic update: Remove from UI immediately since this is the Favorites page
    setWatchlist(prev => prev.filter(i => (i.itemId || i._id) !== itemId));

    try {
      await axios.delete(`/users/watchlist/${itemId}`);
    } catch (err) {
      console.error("Failed to remove from watchlist:", err);
      // Revert if failed (optional, but good UX)
      setWatchlist(prev => [...prev, item]);
    }
  };

  const handleViewItem = (item) => {
    navigate(`/item/${item.itemId || item._id}`);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" className="py-8 min-h-screen bg-[#141414] text-white">
        <Typography variant="h4" className="mb-8 font-bold">My Watchlist</Typography>
        <Grid container spacing={3}>
          {[...Array(8)].map((_, i) => (
            <Grid item xs={6} md={3} lg={2} key={i}>
              <Skeleton variant="rectangular" height={300} className="bg-gray-800 rounded-lg" />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col">
      <Container maxWidth="xl" className="py-8 flex-grow">
        <Typography variant="h4" className="mb-8 font-bold border-l-4 border-red-600 pl-4">
          My Watchlist
        </Typography>
        
        {watchlist.length === 0 ? (
          <Box className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
            <Typography variant="h6">Your watchlist is empty.</Typography>
            <Typography>Start adding movies you want to watch later!</Typography>
          </Box>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {watchlist.map((item) => (
              <div key={item.itemId || item._id} className="h-[380px]">
                <ItemCard 
                  item={item} 
                  onView={handleViewItem} 
                  onFavorite={handleToggleWatchlist}
                  isFavorite={true} // Always true in Favorites page
                />
              </div>
            ))}
          </div>
        )}
      </Container>
      <Footer />
    </div>
  );
}
