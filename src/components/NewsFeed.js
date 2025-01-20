import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid2';

const categories = {
  Healthcare: ['medicine', 'hospital', 'health', 'pharma', 'doctor', 'nurse'],
  Finance: ['economy', 'stock', 'crypto', 'investment', 'bank', 'money', 'trading'],
  Education: ['school', 'university', 'student', 'learning', 'teacher', 'classroom'],
  Technology: ['AI', 'software', 'robot', 'machine learning', 'tech', 'coding', 'programming'],
  Engineering: ['engineer', 'infrastructure', 'mechanical', 'civil', 'electrical', 'design'],
  Marketing: ['advertising', 'campaign', 'promotion', 'branding', 'social media', 'SEO'],
  Law: ['court', 'legal', 'lawyer', 'justice', 'legislation', 'contract', 'policy'],
  HumanResources: ['recruitment', 'hiring', 'employee', 'HR', 'benefits', 'team management'],
  Sports: ['football', 'cricket', 'basketball', 'tennis', 'athlete', 'tournament'],
  Gaming: ['games', 'video games', 'e-sports', 'console', 'streaming', 'gamers'],
  Manufacturing: ['factory', 'production', 'automation', 'machinery', 'supply chain'],
  Transportation: ['cars', 'trucks', 'shipping', 'airlines', 'logistics', 'infrastructure'],
  Journalism: ['news', 'reporting', 'media', 'interview', 'article', 'press'],
  Other: [],
};

const categorizeArticle = (title, description) => {
  const content = `${title} ${description}`.toLowerCase();
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((keyword) => content.includes(keyword))) {
      return category;
    }
  }
  return 'Other';
};

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

        // Filter out articles with "[Removed]" in the title
        fetchedArticles = fetchedArticles.filter(
          (article) =>
            article.title !== '[Removed]' && article.title !== '[removed]'
        );

        // Sort articles by date and categorize
        const categorizedArticles = fetchedArticles
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
          .map((article) => ({
            ...article,
            category: categorizeArticle(article.title, article.description),
          }));

        setArticles(categorizedArticles);

        const dataToStore = {
          articles: categorizedArticles,
          timestamp: Date.now(),
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
      <Typography variant="h5" sx={{ mb: 2 }}>
        AI News: {selectedCategory}
      </Typography>

      {error && (
        <div className="text-red-500 bg-red-50 p-3 rounded mb-3">
          {error}
        </div>
      )}

      {/* Ensure alignItems="stretch" to make columns uniform */}
      <Grid container spacing={3} alignItems="stretch">
        {articles.map((article, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              {article.urlToImage && (
                <CardMedia
                  component="img"
                  image={article.urlToImage}
                  alt={article.title}
                  sx={{ maxHeight: 250, objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom noWrap>
                  {article.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                  className="descriptionClamp"
                >
                  {article.description}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {article.source?.name} •{' '}
                  {new Date(article.publishedAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions sx={{ mt: 'auto' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  component="a"
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default NewsFeed;
