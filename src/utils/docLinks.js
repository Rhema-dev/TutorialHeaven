/**
 * Official documentation links for various technologies
 */

export const OFFICIAL_DOCS = {
  // Programming Languages
  javascript: {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    name: 'MDN JavaScript Docs',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
  },
  python: {
    url: 'https://docs.python.org/3/',
    name: 'Python Official Docs',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'
  },
  typescript: {
    url: 'https://www.typescriptlang.org/docs/',
    name: 'TypeScript Docs',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'
  },

  // Frontend Frameworks
  react: {
    url: 'https://react.dev',
    name: 'React Documentation',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
  },
  vue: {
    url: 'https://vuejs.org/guide/',
    name: 'Vue.js Guide',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg'
  },

  // Backend Technologies
  node: {
    url: 'https://nodejs.org/en/docs/',
    name: 'Node.js Docs',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'
  },
  express: {
    url: 'https://expressjs.com/en/api.html',
    name: 'Express API Reference',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg'
  }
};

/**
 * Gets documentation link for a technology
 * @param {string} tech - Technology name (case insensitive)
 * @returns {object|null} Documentation info or null if not found
 */
export const getOfficialDocs = (tech) => {
  const normalizedTech = tech.toLowerCase().replace(/[^a-z0-9]/g, '');
  return OFFICIAL_DOCS[normalizedTech] || null;
};

/**
 * Gets all docs for a category (lang, frontend, backend)
 */
export const getDocsByCategory = (category) => {
  const categories = {
    languages: ['javascript', 'python', 'typescript'],
    frontend: ['react', 'vue'],
    backend: ['node', 'express']
  };

  return categories[category]?.map(tech => OFFICIAL_DOCS[tech]) || [];
};