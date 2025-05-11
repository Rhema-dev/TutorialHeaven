import React from 'react';
import './DocsLink.css';
import { FaBook, FaExternalLinkAlt } from 'react-icons/fa';

// Pre-defined official documentation links
const OFFICIAL_DOCS = {
  // Programming Languages
  'javascript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  'python': 'https://docs.python.org/3/',
  'typescript': 'https://www.typescriptlang.org/docs/',
  'rust': 'https://doc.rust-lang.org/book/',
  'go': 'https://go.dev/doc/',
  
  // Frontend Frameworks
  'react': 'https://react.dev',
  'vue': 'https://vuejs.org/guide/',
  'angular': 'https://angular.io/docs',
  'svelte': 'https://svelte.dev/docs',
  
  // Backend Technologies
  'node': 'https://nodejs.org/en/docs/',
  'express': 'https://expressjs.com/en/api.html',
  'django': 'https://docs.djangoproject.com/',
  'flask': 'https://flask.palletsprojects.com/',
  
  // Databases
  'mongodb': 'https://www.mongodb.com/docs/',
  'postgresql': 'https://www.postgresql.org/docs/',
  'mysql': 'https://dev.mysql.com/doc/',
  
  // DevOps
  'docker': 'https://docs.docker.com/',
  'kubernetes': 'https://kubernetes.io/docs/home/',
  'terraform': 'https://developer.hashicorp.com/terraform/docs',
};

const DocsLink = ({ skill }) => {
  // Normalize skill name (lowercase, remove special chars)
  const normalizedSkill = skill.toLowerCase().replace(/[^a-z0-9]/g, '');
  const docUrl = OFFICIAL_DOCS[normalizedSkill];

  if (!docUrl) return null;

  return (
    <div className="docs-link-card">
      <div className="docs-header">
        <FaBook className="docs-icon" />
        <h3>Official Documentation</h3>
      </div>
      <a 
        href={docUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="docs-link"
      >
        <span className="docs-url">
          {docUrl.replace(/^https?:\/\//, '')}
        </span>
        <FaExternalLinkAlt className="external-icon" />
      </a>
      <div className="docs-tip">
        Pro Tip: Bookmark this page for quick reference!
      </div>
    </div>
  );
};

export default DocsLink;