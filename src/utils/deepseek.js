/**
 * Configuration and utility functions for DeepSeek API
 */

const DEEPSEEK_API_BASE = 'https://api.deepseek.com/v1';
const API_KEY = process.env.REACT_APP_DEEPSEEK_API_KEY;

/**
 * Fetches learning resources from DeepSeek API
 * @param {string} query - Search query (e.g., "Learn React Hooks")
 * @param {object} options - Additional options
 * @returns {Promise<object>} - Formatted API response
 */
export const fetchLearningResources = async (query, options = {}) => {
  const defaultOptions = {
    max_results: 5,
    resource_types: ['free', 'paid'],
    include_docs: true,
    ...options
  };

  try {
    const response = await fetch(`${DEEPSEEK_API_BASE}/learning/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        query,
        options: defaultOptions
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return formatDeepSeekResponse(data);
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return getFallbackResources(query);
  }
};

/**
 * Formats raw API response into consistent structure
 */
const formatDeepSeekResponse = (response) => {
  return {
    free_resources: response.freeResources?.map(resource => ({
      title: resource.title,
      url: resource.url,
      source: resource.source,
      description: resource.description,
      type: 'free'
    })) || [],
    
    paid_resources: response.paidResources?.map(resource => ({
      title: resource.title,
      url: resource.url,
      source: resource.source,
      price: resource.price,
      description: resource.description,
      type: 'paid'
    })) || [],
    
    concepts: response.relatedConcepts || [],
    projects: response.projectIdeas || []
  };
};

/**
 * Fallback resources when API fails
 */
const getFallbackResources = (query) => {
  console.warn('Using fallback resources for', query);
  return {
    free_resources: [
      {
        title: `Search YouTube for "${query}"`,
        url: `https://youtube.com/results?search_query=${encodeURIComponent(query)}`,
        source: 'YouTube',
        description: 'Video tutorials on this topic',
        type: 'free'
      }
    ],
    paid_resources: [
      {
        title: `Search Udemy for "${query}"`,
        url: `https://udemy.com/courses/search/?q=${encodeURIComponent(query)}`,
        source: 'Udemy',
        price: 'Varies',
        description: 'Paid courses on this topic',
        type: 'paid'
      }
    ],
    concepts: [],
    projects: []
  };
};

/**
 * Fetches project ideas for a specific skill
 */
export const fetchProjectIdeas = async (skill, difficulty = 'beginner') => {
  try {
    const response = await fetch(`${DEEPSEEK_API_BASE}/projects/suggest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        skill,
        difficulty
      })
    });

    return response.json();
  } catch (error) {
    console.error('Failed to fetch project ideas:', error);
    return [];
  }
};