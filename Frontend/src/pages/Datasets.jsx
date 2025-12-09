import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { Container, Grid, FormControl, InputLabel, Select, MenuItem, Typography, Button } from '@mui/material';
import { useToast } from '../components/ToastProvider';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Datasets() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');

  const { showToast } = useToast();

  useEffect(() => {
    loadItems();
  }, [filterParam]);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (filterParam === 'recommended') {
        // If we navigated here for recommendations, we might need to fetch them differently
        // For now, let's just fetch all items, or if there's a specific endpoint for "my recommendations"
        // But Home.jsx just logged them and navigated. 
        // Ideally, we should fetch recommendations here if the filter is set.
        // Let's assume we just show all items for now, or maybe fetch trending.
        res = await axios.get('/items'); 
      } else {
        res = await axios.get('/items');
      }
      setItems(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const filtered = items.filter(it => {
    const matchesQuery = !query || (it.title && it.title.toLowerCase().includes(query.toLowerCase()));
    const matchesCategory = !category || it.category === category;
    return matchesQuery && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // relevance default: keep server order
  });

  const openItem = (item) => navigate(`/item/${item.itemId || item._id}`);

  const addFavorite = async (item) => {
    try {
      await axios.post('/users/watchlist', { itemId: item.itemId || item._id });
      showToast('Added to watchlist', 'success');
    } catch (err) {
      showToast('Failed to add to watchlist', 'error');
    }
  };

  const categories = Array.from(new Set(items.map(i => i.category).filter(Boolean)));

  return (
    <Container className="py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <Typography variant="h5">Datasets & Listings</Typography>
        <div className="w-full md:w-1/2">
          <SearchBar onSearch={setQuery} />
        </div>
      </div>

  <div className="flex gap-6 items-center mb-8">
        <FormControl size="small">
          <InputLabel>Category</InputLabel>
          <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)} style={{ minWidth: 160 }}>
            <MenuItem value="">All</MenuItem>
            {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Sort</InputLabel>
          <Select value={sortBy} label="Sort" onChange={(e) => setSortBy(e.target.value)} style={{ minWidth: 160 }}>
            <MenuItem value="relevance">Relevance</MenuItem>
            <MenuItem value="rating">Top Rated</MenuItem>
          </Select>
        </FormControl>

        <Button onClick={loadItems}>Refresh</Button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>}

      {!loading && !error && (
        <Grid container spacing={4}>
          {filtered.map(item => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.itemId || item._id}>
              <ItemCard item={item} onView={openItem} onFavorite={addFavorite} />
            </Grid>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-500">No items match your search.</div>
          )}
        </Grid>
      )}
    </Container>
  );
}
