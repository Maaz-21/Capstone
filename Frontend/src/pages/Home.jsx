import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Button, Box, Skeleton, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';

// --- Components ---

const MovieCarousel = ({ title, items, loading, onView, onAddToWatchlist, watchlist = [], onRemove }) => {
  const scrollRef = React.useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += scrollOffset;
    }
  };

  return (
    <div className="my-8 relative group">
      <Typography variant="h5" className="font-bold mb-4 px-4 md:px-0 text-white">
        {title}
      </Typography>
      
      <div className="relative">
        {/* Left Arrow */}
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <IconButton onClick={() => scroll(-300)} className="text-white hover:bg-white/20">
            <ArrowBackIosNewIcon />
          </IconButton>
        </div>

        {/* Carousel Container */}
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 px-4 md:px-0 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="min-w-[200px] md:min-w-[240px]">
                <Skeleton variant="rectangular" height={360} className="rounded-lg bg-gray-800" />
                <Skeleton width="60%" className="mt-2 bg-gray-800" />
              </div>
            ))
          ) : (
            items.map((item) => {
              const isInWatchlist = watchlist.includes(item.itemId || item._id);
              return (
                <div key={item.itemId || item._id} className="min-w-[200px] md:min-w-[240px] h-[360px] relative group/card">
                  <ItemCard 
                    item={item} 
                    onView={onView} 
                    onFavorite={onAddToWatchlist}
                    isFavorite={isInWatchlist}
                    onRemove={onRemove}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Right Arrow */}
        <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <IconButton onClick={() => scroll(300)} className="text-white hover:bg-white/20">
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

const GenreCard = ({ genre, onClick, isSelected }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => onClick(genre)}
    className={`cursor-pointer min-w-[160px] h-[100px] rounded-lg border flex items-center justify-center transition-colors shadow-lg ${
      isSelected 
        ? 'bg-blue-900 border-blue-500' 
        : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-blue-500'
    }`}
  >
    <Typography variant="h6" className="font-bold text-gray-300">
      {genre}
    </Typography>
  </motion.div>
);

// --- Main Page Component ---

export default function Home() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [watchlist, setWatchlist] = useState([]); // Store itemIds
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Genre Exploration State
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreItems, setGenreItems] = useState([]);
  const [loadingGenre, setLoadingGenre] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get('/items/trending');
        setTrending(res.data);
      } catch (err) {
        console.error("Error fetching trending:", err);
      } finally {
        setLoadingTrending(false);
      }
    };

    const fetchRecent = async () => {
      if (authLoading) return; // Wait for auth to initialize
      
      if (user) {
        try {
          // Use the 'interests' endpoint which combines history and ratings
          const res = await axios.get('/users/interests');
          setRecent(res.data);
        } catch (err) {
          console.error("Error fetching recent:", err);
        } finally {
          setLoadingRecent(false);
        }
      } else {
        setLoadingRecent(false);
      }
    };

    const fetchWatchlist = async () => {
      if (authLoading) return; // Wait for auth to initialize

      if (user) {
        try {
          const res = await axios.get('/users/watchlist');
          // Assuming endpoint returns array of items, we map to IDs for checking
          setWatchlist(res.data.map(item => item.itemId || item._id));
        } catch (err) {
          console.error("Error fetching watchlist:", err);
        }
      }
    };

    fetchTrending();
    fetchRecent();
    fetchWatchlist();
  }, [user, authLoading]);

  const handleSearch = async (query) => {
    if (!query) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const res = await axios.get(`/items/search?q=${query}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleGenreClick = async (genre) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null); // Toggle off
      setGenreItems([]);
      return;
    }

    setSelectedGenre(genre);
    setLoadingGenre(true);
    try {
      const res = await axios.get(`/items?genre=${genre}`);
      setGenreItems(res.data);
    } catch (err) {
      console.error("Error fetching genre items:", err);
    } finally {
      setLoadingGenre(false);
    }
  };

  const handleAddToWatchlist = async (item) => {
    if (!user) return;
    const itemId = item.itemId || item._id;
    const isAdded = watchlist.includes(itemId);

    try {
      if (isAdded) {
        await axios.delete(`/users/watchlist/${itemId}`);
        setWatchlist(prev => prev.filter(id => id !== itemId));
      } else {
        await axios.post('/users/watchlist', { itemId });
        setWatchlist(prev => [...prev, itemId]);
      }
    } catch (err) {
      console.error("Watchlist action failed:", err);
    }
  };

  const handleRemoveFromRecent = async (item) => {
    if (!user) return;
    const itemId = item.itemId || item._id;
    
    try {
      await axios.delete(`/users/recent/${itemId}`);
      setRecent(prev => prev.filter(i => (i.itemId || i._id) !== itemId));
    } catch (err) {
      console.error("Failed to remove from recent:", err);
    }
  };

  const handleGetRecommendations = async () => {
    if (!user) return;
    try {
      // Using POST /model/recommend as per backend routes
      const res = await axios.post('/model/recommend', { user_id: user.id });
      console.log("Recommendations:", res.data);
      navigate('/datasets?filter=recommended'); 
    } catch (err) {
      console.error("Recommendation error:", err);
    }
  };

  const handleViewItem = async (item) => {
    // Navigation only - ItemDetails page handles the history update
    navigate(`/item/${item.itemId || item._id}`);
  };

  const genres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", 
    "Documentary", "Drama", "Family", "Fantasy", "Horror", 
    "Mystery", "Romance", "Sci-Fi", "Thriller"
  ];

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      
      {/* Hero Section */}
      <div className="relative h-[50vh] w-full bg-gradient-to-b from-gray-900 to-[#141414] flex flex-col items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden opacity-30">
           <img src="https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg" alt="Background" className="w-full h-full object-cover" />
        </div>
        
        <div className="z-10 w-full max-w-3xl text-center space-y-6">
          <Typography variant="h2" className="font-bold text-white drop-shadow-lg md:text-6xl">
            Find Your Next Favorite
          </Typography>
          <Typography variant="h6" className="text-gray-300 drop-shadow-md">
            Discover movies tailored to your taste using AI.
          </Typography>
          
          <div className="w-full bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20 shadow-xl">
            <SearchBar 
              onSearch={handleSearch} 
              placeholder="Search for movies, genres, or actors..." 
              delay={500}
            />
          </div>
        </div>
      </div>

      <Container maxWidth="xl" className="py-8 space-y-12">
        
        {/* Search Results (if any) */}
        {isSearching && (
          <MovieCarousel 
            title="Search Results" 
            items={searchResults} 
            loading={false} 
            onView={handleViewItem}
            onAddToWatchlist={handleAddToWatchlist}
            watchlist={watchlist}
          />
        )}

        {/* Trending Movies */}
        <MovieCarousel 
          title="Trending Now" 
          items={trending} 
          loading={loadingTrending} 
          onView={handleViewItem}
          onAddToWatchlist={handleAddToWatchlist}
          watchlist={watchlist}
        />

        {/* Personalized Recommendation Call-to-Action */}
        <div className="flex justify-center py-8">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleGetRecommendations}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-4 px-12 rounded-full text-lg shadow-lg flex items-center gap-2"
            >
              <PlayArrowIcon fontSize="large" />
              Get Personalized Recommendations
            </Button>
          </motion.div>
        </div>

        {/* Recent Interest */}
        <div id="recent-interest-section">
          <Typography variant="h5" className="font-bold px-4 md:px-0 text-white mb-4">
              Recent Interest
          </Typography>
          
          {recent.length > 0 ? (
            <MovieCarousel 
              title="" // Title handled by parent header
              items={recent} 
              loading={loadingRecent} 
              onView={handleViewItem}
              onAddToWatchlist={handleAddToWatchlist}
              watchlist={watchlist}
              onRemove={handleRemoveFromRecent}
            />
          ) : (
            <Typography className="text-gray-500 italic px-4 md:px-0">
              Start watching or rating movies to see your recent interests here.
            </Typography>
          )}
        </div>

        {/* Explore by Genre */}
        <div className="space-y-4">
          <Typography variant="h5" className="font-bold px-4 md:px-0 text-white">
            Explore by Genre
          </Typography>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 px-4 md:px-0">
            {genres.map((genre) => (
              <GenreCard 
                key={genre} 
                genre={genre} 
                isSelected={selectedGenre === genre}
                onClick={handleGenreClick} 
              />
            ))}
          </div>

          {/* Genre Results Injection Point */}
          {selectedGenre && (
            <div className="mt-8 bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="text-blue-400 font-bold">
                  Top in {selectedGenre}
                </Typography>
                <Button size="small" onClick={() => setSelectedGenre(null)} className="text-gray-400">Close</Button>
              </div>
              
              {loadingGenre ? (
                <div className="flex gap-4 overflow-hidden">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} variant="rectangular" width={200} height={300} className="bg-gray-800 rounded" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {genreItems.map(item => (
                    <div key={item.itemId || item._id} className="relative group/card">
                      <ItemCard 
                        item={item} 
                        onView={handleViewItem} 
                        onFavorite={handleAddToWatchlist}
                        isFavorite={watchlist.includes(item.itemId || item._id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </Container>

      <Footer />
    </div>
  );
}
