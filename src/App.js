// src/App.js

import React, { useState } from 'react';
import Header from './components/Header';
import NewsFeed from './components/NewsFeed';
import CategorySelector from './components/CategorySelector';
import Footer from './components/Footer';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('Healthcare');

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Header />
      <main className="w-full max-w-3xl flex flex-col items-center px-2">
        {/* Category Selector */}
        <CategorySelector
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* News Feed based on selected category */}
        <NewsFeed selectedCategory={selectedCategory} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
