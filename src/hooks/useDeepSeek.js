import { useState } from 'react';

const useDeepSeek = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResources = async (query) => {
    setLoading(true);
    setError(null);

    try {
      // In a real implementation, you would call the actual DeepSeek API
      // This is a mock implementation that simulates API responses
      const response = await simulateDeepSeekAPI(query);
      
      // Transform the API response into our app's format
      return transformAPIResponse(response, query);
    } catch (err) {
      setError(err.message || 'Failed to fetch resources');
      console.error('DeepSeek API error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Simulates the DeepSeek API call
  const simulateDeepSeekAPI = async (query) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock response based on query
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('react')) {
      return mockReactResources();
    } else if (queryLower.includes('javascript')) {
      return mockJavaScriptResources();
    } else if (queryLower.includes('python')) {
      return mockPythonResources();
    } else {
      return mockGenericResources(query);
    }
  };

  // Transforms API response to our format
  const transformAPIResponse = (apiResponse, query) => {
    return {
      free_resources: apiResponse.freeResources?.map(resource => ({
        title: resource.title,
        url: resource.link,
        source: resource.source,
        description: resource.description
      })) || [],
      
      paid_resources: apiResponse.paidResources?.map(resource => ({
        title: resource.title,
        url: resource.link,
        source: resource.source,
        price: resource.price,
        description: resource.description
      })) || []
    };
  };

  // Mock data generators
  const mockReactResources = () => ({
    freeResources: [
      {
        title: "React Official Documentation",
        link: "https://react.dev",
        source: "React Docs",
        description: "The official React documentation"
      },
      {
        title: "Learn React in 5 Hours - FreeCodeCamp",
        link: "https://youtube.com/watch?v=react-course",
        source: "FreeCodeCamp",
        description: "Comprehensive free React course"
      }
    ],
    paidResources: [
      {
        title: "Modern React with Redux",
        link: "https://udemy.com/react-redux",
        source: "Udemy",
        price: "$12.99",
        description: "Master React and Redux with this bestseller"
      }
    ]
  });

  const mockJavaScriptResources = () => ({
    freeResources: [
      {
        title: "JavaScript.info - The Modern JavaScript Tutorial",
        link: "https://javascript.info",
        source: "javascript.info",
        description: "Comprehensive JavaScript guide"
      }
    ],
    paidResources: [
      {
        title: "JavaScript: The Advanced Concepts",
        link: "https://udemy.com/js-advanced",
        source: "Udemy",
        price: "$14.99",
        description: "Master advanced JavaScript patterns"
      }
    ]
  });

  const mockPythonResources = () => ({
    freeResources: [
      {
        title: "Python Official Documentation",
        link: "https://docs.python.org/3/",
        source: "Python.org",
        description: "Official Python language docs"
      }
    ],
    paidResources: []
  });

  const mockGenericResources = (query) => ({
    freeResources: [
      {
        title: `Search YouTube for "${query}"`,
        link: `https://youtube.com/results?search_query=${encodeURIComponent(query)}`,
        source: "YouTube",
        description: "Find video tutorials on this topic"
      },
      {
        title: `Search FreeCodeCamp for "${query}"`,
        link: `https://freecodecamp.org/search?query=${encodeURIComponent(query)}`,
        source: "FreeCodeCamp",
        description: "Free coding resources and tutorials"
      }
    ],
    paidResources: [
      {
        title: `Search Udemy for "${query}"`,
        link: `https://udemy.com/courses/search/?q=${encodeURIComponent(query)}`,
        source: "Udemy",
        price: "Varies",
        description: "Browse paid courses on this topic"
      }
    ]
  });

  return { fetchResources, loading, error };
};

export default useDeepSeek;