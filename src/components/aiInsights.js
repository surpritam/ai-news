// aiInsights.js
// Utility for extracting entities and keywords from news articles using Hugging Face Inference API
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.REACT_APP_HF_API_KEY);

// Extract named entities (companies, technologies, etc.) from text
export async function extractEntities(text) {
  try {
    const result = await hf.tokenClassification({
      model: 'dslim/bert-base-NER',
      inputs: text,
    });
    // Filter for ORG (organization/company), MISC (tech, etc.), and PRODUCT
    return result.filter(e => ['ORG', 'MISC', 'PRODUCT'].includes(e.entity_group));
  } catch (error) {
    console.error('Entity extraction error:', error);
    return [];
  }
}

// Extract keywords using a simple frequency approach
export function extractKeywords(articles) {
  const freq = {};
  articles.forEach(article => {
    const words = (article.title + ' ' + article.description)
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .split(' ');
    words.forEach(word => {
      if (word.length > 3) freq[word] = (freq[word] || 0) + 1;
    });
  });
  // Return top 10 keywords
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}
