// src/App.js

import React, { useState } from 'react';
import Header from './components/Header';
import NewsFeed from './components/NewsFeed';
import CategorySelector from './components/CategorySelector';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('Healthcare');

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />

      {/* Category Selector */}
      <CategorySelector
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* News Feed based on selected category */}
      <NewsFeed selectedCategory={selectedCategory} />
    </div>
  );
}

export default App;
