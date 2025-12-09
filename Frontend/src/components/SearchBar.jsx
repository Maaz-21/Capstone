import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// Reusable search bar with optional debounce
export default function SearchBar({ initial = '', onSearch, delay = 300, placeholder = 'Search items...' }) {
  const [query, setQuery] = useState(initial);

  useEffect(() => {
    const t = setTimeout(() => {
      onSearch(query);
    }, delay);
    return () => clearTimeout(t);
  }, [query, delay, onSearch]);

  return (
    <TextField
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={placeholder}
      variant="outlined"
      size="small"
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
