import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function CategorySelector({ selectedCategory, onCategoryChange }) {
  // Extended list of AI-related or general categories
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
    <Box sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
      <FormControl fullWidth>
        <InputLabel id="category-label">Select Your Profession</InputLabel>
        <Select
          labelId="category-label"
          value={selectedCategory}
          label="Select Your Profession"
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default CategorySelector;
