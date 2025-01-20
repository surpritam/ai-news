// src/components/NewsFeed.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NewsFeed({ selectedCategory }) {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_NEWSAPI_KEY;
  const CACHE_EXPIRATION = 3600000; // 1 hour

  useEffect(() => {
    if (!API_KEY) {
      setError('No API key found. Please set REACT_APP_NEWSAPI_KEY in .env');
      return;
    }

    const cacheKey = `news_${selectedCategory}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const now = Date.now();

      if (now - parsedData.timestamp < CACHE_EXPIRATION) {
        console.log(`Using cached data for category: ${selectedCategory}`);
        setArticles(parsedData.articles);
        return;
      }
    }

    const fetchNews = async () => {
      try {
        const query = `AI%20AND%20${encodeURIComponent(selectedCategory)}`;
        const url = `https://newsapi.org/v2/everything?q=${query}&language=en&apiKey=${API_KEY}`;
        const response = await axios.get(url);

        let fetchedArticles = response.data.articles || [];

        // 1) Filter out articles with "[Removed]" in the title
        fetchedArticles = fetchedArticles.filter(article => (
          article.title !== '[Removed]' && article.title !== '[removed]'
        ));

        setArticles(fetchedArticles);

        // 2) Save to localStorage with timestamp
        const dataToStore = {
          articles: fetchedArticles,
          timestamp: Date.now()
        };
        localStorage.setItem(cacheKey, JSON.stringify(dataToStore));
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load articles');
      }
    };

    fetchNews();
  }, [API_KEY, selectedCategory]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">
        AI News: {selectedCategory}
      </h2>

      {error && (
        <div className="text-red-500 bg-red-50 p-3 rounded mb-3">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {articles.map((article, index) => (
          <div key={index} className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-medium">{article.title}</h3>
            <p className="text-sm text-gray-700 mt-1">{article.description}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-500 mt-2"
            >
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsFeed;
