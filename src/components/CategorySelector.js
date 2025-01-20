import React from 'react';

function CategorySelector({ selectedCategory, onCategoryChange }) {
  // Extended list of AI-related or general categories
  const categories = [
    'Healthcare',
    'Finance',
    'Education',
    'Engineering',
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
    <div className="p-4 bg-gray-200">
      <h3 className="text-md font-medium mb-2">Select Your Profession:</h3>
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        // Make the text larger & more spaced
        className="border p-3 rounded text-base"
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
