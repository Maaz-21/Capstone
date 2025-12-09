import React from 'react';
import RecommendationCard from './RecommendationCard';

export default function SimilarRecommendations({ items = [], onView, onFavorite }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Similar Recommendations</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map(it => (
          <RecommendationCard key={it.itemId || it._id} item={it} onView={onView} onFavorite={onFavorite} />
        ))}
      </div>
    </div>
  );
}
