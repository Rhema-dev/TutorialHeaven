import { useState, useEffect } from 'react';

// Comprehensive documentation database
const OFFICIAL_DOCS_DATABASE = {
  // Programming Languages
  'javascript': {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    title: 'MDN JavaScript Docs',
    description: 'Mozilla Developer Network JavaScript documentation'
  },
  'python': {
    url: 'https://docs.python.org/3/',
    title: 'Python Official Documentation',
    description: 'Official documentation for Python programming language'
  },
  'typescript': {
    url: 'https://www.typescriptlang.org/docs/',
    title: 'TypeScript Documentation',
    description: 'Official TypeScript language documentation'
  },
  'rust': {
    url: 'https://doc.rust-lang.org/book/',
    title: 'The Rust Programming Language',
    description: 'Affectionately nicknamed "The Rust Book"'
  },
  'go': {
    url: 'https://go.dev/doc/',
    title: 'Go Documentation',
    description: 'Official Go programming language docs'
  },

  // Frontend Frameworks
  'react': {
    url: 'https://react.dev',
    title: 'React Documentation',
    description: 'Official React documentation with interactive examples'
  },
  'vue': {
    url: 'https://vuejs.org/guide/',
    title: 'Vue.js Guide',
    description: 'Vue.js official documentation'
  },
  'angular': {
    url: 'https://angular.io/docs',
    title: 'Angular Documentation',
    description: 'Official Angular framework docs'
  },
  'svelte': {
    url: 'https://svelte.dev/docs',
    title: 'Svelte Docs',
    description: 'Svelte framework documentation'
  },

  // Backend Technologies
  'node': {
    url: 'https://nodejs.org/en/docs/',
    title: 'Node.js Docs',
    description: 'Official Node.js documentation'
  },
  'express': {
    url: 'https://expressjs.com/en/api.html',
    title: 'Express API Reference',
    description: 'Express.js framework API documentation'
  },
  'django': {
    url: 'https://docs.djangoproject.com/',
    title: 'Django Documentation',
    description: 'Official Django web framework docs'
  },
  'flask': {
    url: 'https://flask.palletsprojects.com/',
    title: 'Flask Documentation',
    description: 'Flask web framework official docs'
  },

  // Databases
  'mongodb': {
    url: 'https://www.mongodb.com/docs/',
    title: 'MongoDB Documentation',
    description: 'Official MongoDB documentation'
  },
  'postgresql': {
    url: 'https://www.postgresql.org/docs/',
    title: 'PostgreSQL Docs',
    description: 'PostgreSQL relational database documentation'
  },
  'mysql': {
    url: 'https://dev.mysql.com/doc/',
    title: 'MySQL Reference Manual',
    description: 'Official MySQL database documentation'
  },

  // DevOps & Tools
  'docker': {
    url: 'https://docs.docker.com/',
    title: 'Docker Documentation',
    description: 'Official Docker container platform docs'
  },
  'kubernetes': {
    url: 'https://kubernetes.io/docs/home/',
    title: 'Kubernetes Documentation',
    description: 'Official Kubernetes docs'
  },
  'terraform': {
    url: 'https://developer.hashicorp.com/terraform/docs',
    title: 'Terraform Docs',
    description: 'Terraform infrastructure as code documentation'
  }
};

const useOfficialDocs = () => {
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDocs = (skill) => {
    setLoading(true);
    setError(null);

    try {
      // Normalize skill name (lowercase, remove special chars)
      const normalizedSkill = skill.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Simulate API delay
      setTimeout(() => {
        const foundDocs = OFFICIAL_DOCS_DATABASE[normalizedSkill] || null;
        
        if (foundDocs) {
          setDocs({
            ...foundDocs,
            skill: skill // Preserve original skill name capitalization
          });
        } else {
          setError(`No official documentation found for ${skill}`);
        }
        
        setLoading(false);
      }, 300);
    } catch (err) {
      setError('Error fetching documentation');
      setLoading(false);
      console.error('Documentation lookup error:', err);
    }
  };

  // Clear docs when unmounting or when skill changes
  useEffect(() => {
    return () => {
      setDocs(null);
    };
  }, []);

  return { docs, getDocs, loading, error };
};

export default useOfficialDocs;