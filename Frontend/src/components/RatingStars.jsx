import React from 'react';
import { Rating } from '@mui/material';

export default function RatingStars({ value = 0, readOnly = false, onChange }) {
  return (
    <div className="flex items-center">
      <Rating
        name="rating"
        value={value}
        readOnly={readOnly}
        onChange={(e, v) => onChange && onChange(v)}
      />
      <span className="ml-2 text-sm text-gray-600">{value ? value.toFixed(1) : 'No rating'}</span>
    </div>
  );
}
