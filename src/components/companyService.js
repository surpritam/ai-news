// companyService.js
// Fetch a dynamic list of publicly traded companies (e.g., S&P 500) from Yahoo Finance

import Papa from 'papaparse';

export async function fetchSP500Companies() {
  // Use local static CSV for CORS-safe fetch
  const url = '/constituents.csv';
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch company list');
  const csvText = await response.text();
  console.log('Raw CSV:', csvText.slice(0, 500)); // Debug: show first 500 chars
  const parsed = Papa.parse(csvText, { header: true });
  console.log('Parsed data:', parsed.data.slice(0, 5)); // Debug: show first 5 rows
  // Use Security for company name
  const filtered = parsed.data.filter(row => row.Symbol && row.Security);
  console.log('Filtered companies:', filtered.slice(0, 5)); // Debug: show first 5 filtered
  return filtered;
}
