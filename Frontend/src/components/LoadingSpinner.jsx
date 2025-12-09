import React from 'react';
import { CircularProgress, Box } from '@mui/material';

export default function LoadingSpinner({ size = 48 }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
      <CircularProgress size={size} thickness={4} />
    </Box>
  );
}
