import React from 'react';

function CategorySelector({ selectedCategory, onCategoryChange }) {
  const categories = [
    'Healthcare',
    'Finance',
    'Education',
    'Engineering',
    'Technology',
    'Marketing',
    'Law',
    'Human Resources',
    'Sports',
    'Gaming',
    'Manufacturing',
    'Transportation',
    'Journalism'
  ];

  return (
    <div className="w-full flex justify-center my-4">
      <select
        className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 text-base"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategorySelector;
