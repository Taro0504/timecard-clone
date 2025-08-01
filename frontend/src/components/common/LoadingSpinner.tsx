import { memo } from 'react';

export const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">読み込み中...</p>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';
