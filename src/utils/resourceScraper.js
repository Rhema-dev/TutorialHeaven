/**
 * Utilities for scraping/aggregating learning resources
 */

import { getOfficialDocs } from './docLinks';

/**
 * Generates search URLs for various platforms
 */
export const generateSearchUrls = (query) => {
  return {
    youtube: `https://youtube.com/results?search_query=${encodeURIComponent(query)}`,
    udemy: `https://udemy.com/courses/search/?q=${encodeURIComponent(query)}`,
    coursera: `https://www.coursera.org/search?query=${encodeURIComponent(query)}`,
    freecodecamp: `https://freecodecamp.org/search?query=${encodeURIComponent(query)}`,
    mdn: `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(query)}`
  };
};

/**
 * Normalizes resource data from different sources
 */
export const normalizeResources = (resources) => {
  return resources.map(resource => ({
    title: resource.title || resource.name,
    url: resource.url || resource.link,
    source: resource.source || resource.provider,
    type: resource.type || (resource.price ? 'paid' : 'free'),
    price: resource.price,
    description: resource.description,
    rating: resource.rating,
    date: resource.date ? new Date(resource.date) : null
  }));
};

/**
 * Filters resources by type, date, rating etc.
 */
export const filterResources = (resources, filters) => {
  return resources.filter(resource => {
    // Type filter
    if (filters.type && resource.type !== filters.type) return false;
    
    // Free/paid filter
    if (filters.freeOnly && resource.type === 'paid') return false;
    
    // Minimum rating
    if (filters.minRating && (!resource.rating || resource.rating < filters.minRating)) return false;
    
    // Date range
    if (filters.startDate && resource.date && resource.date < new Date(filters.startDate)) return false;
    if (filters.endDate && resource.date && resource.date > new Date(filters.endDate)) return false;
    
    return true;
  });
};

/**
 * Gets all available resources for a technology
 * @param {string} tech - Technology name
 * @returns {object} Combined resources
 */
export const getAllTechResources = async (tech) => {
  const docs = getOfficialDocs(tech);
  const searchUrls = generateSearchUrls(`Learn ${tech}`);
  
  return {
    officialDocs: docs,
    platforms: {
      youtube: searchUrls.youtube,
      udemy: searchUrls.udemy,
      coursera: searchUrls.coursera
    },
    // In a real app, these would come from APIs
    freeResources: [
      {
        title: `${tech} Crash Course`,
        url: searchUrls.youtube,
        source: 'YouTube',
        type: 'free'
      }
    ],
    paidResources: [
      {
        title: `Complete ${tech} Bootcamp`,
        url: searchUrls.udemy,
        source: 'Udemy',
        type: 'paid',
        price: '$12.99'
      }
    ]
  };
};