/*
 * Copyright (c) 2025 Pritam Sur
 *
 * This file is part of the AI Daily Digest project.
 *
 * AI Daily Digest is open source software licensed under the MIT License.
 * See the LICENSE file in the project root for more information.
 */

import React, { useEffect, useState } from 'react';
import { extractEntities } from './aiInsights';

// Helper: Clean and normalize company names for better ticker search
function normalizeCompanyName(name) {
  return name
    .replace(/[,.!?-]/g, '') // removed unnecessary escape characters
    .replace(/\b(inc|ltd|llc|corp|corporation|co|plc|limited)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Helper: Fetch ticker for a company name using Yahoo Finance public API
async function fetchTicker(company) {
  const normalized = normalizeCompanyName(company);
  const queries = [normalized, normalized + ' Inc', normalized + ' Ltd'];
  for (const q of queries) {
    try {
      const response = await fetch(`https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=3&newsCount=0`);
      const data = await response.json();
      if (data.quotes && data.quotes.length > 0) {
        // Only allow public companies (EQUITY) or private companies (PRIVATE_COMPANY)
        const quote = data.quotes.find(q => q.quoteType === 'EQUITY' || q.quoteType === 'PRIVATE_COMPANY');
        if (quote) {
          if (quote.quoteType === 'EQUITY') {
            return {
              ticker: quote.symbol,
              url: `https://finance.yahoo.com/quote/${quote.symbol}`,
              type: 'public',
            };
          } else if (quote.quoteType === 'PRIVATE_COMPANY') {
            return {
              ticker: null,
              url: `https://finance.yahoo.com/quote/${quote.symbol}`,
              type: 'private',
            };
          }
        }
      }
    } catch (e) {
      // ignore errors
    }
  }
  // Fallback: Google search link
  return null;
}

function NewsFeed({ selectedCategory }) {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState({ companies: [], technologies: [], keywords: [] });
  const [companyLinks, setCompanyLinks] = useState({});

  const API_KEY = process.env.REACT_APP_GNEWS_API_KEY;
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
        const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&country=us&max=50&apikey=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        let fetchedArticles = data.articles || [];
        fetchedArticles = fetchedArticles.filter(
          (article) =>
            article.title !== '[Removed]' && article.title !== '[removed]'
        );
        const categorizedArticles = fetchedArticles
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
          .map((article) => ({ ...article }));
        setArticles(categorizedArticles);
        const dataToStore = {
          articles: categorizedArticles,
          timestamp: Date.now(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(dataToStore));
      } catch (err) {
        setError('Failed to load articles');
      }
    };
    fetchNews();
  }, [API_KEY, selectedCategory]);

  useEffect(() => {
    const analyze = async () => {
      if (!articles.length) return;
      const allText = articles.map(a => `${a.title}. ${a.description}`).join(' ');
      const entities = await extractEntities(allText);
      const companies = [...new Set(entities.filter(e => e.entity_group === 'ORG').map(e => e.word))];
      // Improved: Only show technologies that appear in at least 2 articles and are not company names
      const techCounts = {};
      entities.filter(e => e.entity_group === 'MISC' || e.entity_group === 'PRODUCT').forEach(e => {
        const word = e.word.trim();
        if (!companies.includes(word)) {
          techCounts[word] = (techCounts[word] || 0) + 1;
        }
      });
      // Show top 10 technologies, even if they only appear once
      const technologies = Object.entries(techCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word]) => word);
      // Improved: Hot topics = keywords that appear in at least 2 articles and are not in companies or technologies
      const keywordCounts = {};
      articles.forEach(article => {
        const words = (article.title + ' ' + article.description)
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, '')
          .split(' ');
        words.forEach(word => {
          if (word.length > 3 && !companies.map(c => c.toLowerCase()).includes(word) && !technologies.map(t => t.toLowerCase()).includes(word)) {
            keywordCounts[word] = (keywordCounts[word] || 0) + 1;
          }
        });
      });
      const keywords = Object.entries(keywordCounts)
        .filter(([_, count]) => count > 1)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word]) => word);
      setInsights({ companies, technologies, keywords });
    };
    analyze();
  }, [articles]);

  // Real-time fetch for trending companies' tickers/links
  useEffect(() => {
    async function updateCompanyLinks() {
      const links = { ...companyLinks };
      const companiesToFetch = insights.companies.filter(c => !(c in links));
      if (companiesToFetch.length === 0) return;
      // Fetch all tickers in parallel
      const results = await Promise.all(companiesToFetch.map(async (c) => {
        const info = await fetchTicker(c);
        return { c, info };
      }));
      results.forEach(({ c, info }) => {
        links[c] = info;
      });
      setCompanyLinks({ ...links });
    }
    if (insights.companies.length > 0) updateCompanyLinks();
    // eslint-disable-next-line
  }, [insights.companies]);

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4 text-center w-full">AI News: {selectedCategory}</h2>
      {(insights.companies.length > 0 || insights.technologies.length > 0 || insights.keywords.length > 0) && (
        <section className="w-full max-w-3xl mb-6">
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-200 shadow-md px-8 py-6 flex flex-col gap-4 transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 0h-1v-4h-1m-4 0h-1v-4h-1m4 0h-1v-4h-1" /></svg>
              <h3 className="font-bold text-lg text-blue-900 tracking-tight">Market Insights</h3>
            </div>
            {insights.companies.length > 0 && (
              <div className="flex flex-wrap items-center text-sm text-gray-800">
                <span className="font-semibold mr-2 text-blue-700">Trending Companies:</span>
                {insights.companies.map((c) => {
                  const info = companyLinks[c];
                  if (info === undefined) {
                    return (
                      <span key={c} className="bg-blue-50 text-blue-400 rounded-full px-3 py-1 mr-2 mb-2 text-xs font-medium shadow-sm animate-pulse">{c}</span>
                    );
                  }
                  if (info && (info.type === 'public' || info.type === 'private')) {
                    return (
                      <a
                        key={c}
                        href={info.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 mr-2 mb-2 text-xs font-medium shadow-sm hover:bg-blue-200 transition-colors underline"
                      >
                        {c}{info.ticker ? ` (${info.ticker})` : ' (Startup)'}
                      </a>
                    );
                  }
                  // Fallback: Always show a Google search link if not found in Yahoo Finance
                  return (
                    <a
                      key={c}
                      href={`https://www.google.com/search?q=${encodeURIComponent(c + ' AI company')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-50 text-blue-700 rounded-full px-3 py-1 mr-2 mb-2 text-xs font-medium shadow-sm hover:bg-blue-100 transition-colors underline opacity-80"
                    >
                      {c}
                    </a>
                  );
                })}
              </div>
            )}
            {insights.technologies.length > 0 && (
              <div className="flex flex-wrap items-center text-sm text-gray-800">
                <span className="font-semibold mr-2 text-indigo-700">Emerging Technologies:</span>
                {insights.technologies.map((t, i) => (
                  <span key={t} className="bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 mr-2 mb-2 text-xs font-medium shadow-sm">{t}</span>
                ))}
              </div>
            )}
            {insights.keywords.length > 0 && (
              <div className="flex flex-wrap items-center text-sm text-gray-800">
                <span className="font-semibold mr-2 text-emerald-700">Hot Topics:</span>
                {insights.keywords.map((k, i) => (
                  <span key={k} className="bg-emerald-100 text-emerald-800 rounded-full px-3 py-1 mr-2 mb-2 text-xs font-medium shadow-sm">{k}</span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
      {error && (
        <div className="text-red-500 bg-red-50 p-3 rounded mb-3 w-full max-w-2xl text-center">
          {error}
        </div>
      )}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
        {articles.map((article, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
            {article.image && (
              <img src={article.image} alt={article.title} className="w-full h-48 object-cover rounded mb-3" />
            )}
            <div className="flex-1 flex flex-col">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-3">{article.description}</p>
              <div className="text-xs text-gray-400 mt-auto">{article.source?.name} • {new Date(article.publishedAt).toLocaleDateString()}</div>
            </div>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-blue-600 hover:underline text-sm font-medium"
            >
              Read More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsFeed;
