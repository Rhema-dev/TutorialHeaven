import React, { useState, useEffect } from 'react';
import './Resources.css';
import { FaYoutube, FaGraduationCap, FaBook, FaExternalLinkAlt, FaSearch, FaFilter } from 'react-icons/fa';
import useDeepSeek from '../../hooks/useDeepSeek';

const Resources = ({ skill, topic }) => {
  const [resources, setResources] = useState({
    free: [],
    paid: [],
    docs: null
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [resourceType, setResourceType] = useState('all');
  const { fetchResources } = useDeepSeek();

  // Official documentation links
  const OFFICIAL_DOCS = {
    'react': 'https://react.dev',
    'python': 'https://docs.python.org/3/',
    'javascript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    'rust': 'https://doc.rust-lang.org/book/'
  };

  useEffect(() => {
    const loadResources = async () => {
      setLoading(true);
      
      try {
        // Get official docs if available
        const docsUrl = OFFICIAL_DOCS[skill.toLowerCase()];
        
        // Fetch from DeepSeek API
        const query = topic ? `${skill} ${topic}` : skill;
        const apiResults = await fetchResources(`Best resources to learn ${query}`);
        
        setResources({
          free: apiResults?.free_resources || [],
          paid: apiResults?.paid_resources || [],
          docs: docsUrl
        });
      } catch (error) {
        console.error("Error loading resources:", error);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [skill, topic]);

  const filteredResources = () => {
    let result = [];
    const query = searchQuery.toLowerCase();

    // Combine all resources
    if (resources.docs) {
      result.push({
        type: 'docs',
        title: `${skill} Official Documentation`,
        url: resources.docs,
        source: 'Official'
      });
    }

    result = [
      ...result,
      ...resources.free.map(r => ({ ...r, type: 'free' })),
      ...resources.paid.map(r => ({ ...r, type: 'paid' }))
    ];

    // Apply filters
    return result.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(query) || 
                          resource.source?.toLowerCase().includes(query);
      const matchesType = resourceType === 'all' || resource.type === resourceType;
      return matchesSearch && matchesType;
    });
  };

  const getResourceIcon = (type) => {
    switch(type) {
      case 'free': return <FaYoutube className="icon free" />;
      case 'paid': return <FaGraduationCap className="icon paid" />;
      case 'docs': return <FaBook className="icon docs" />;
      default: return <FaExternalLinkAlt className="icon" />;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading resources for {skill}{topic ? ` (${topic})` : ''}...</p>
      </div>
    );
  }

  return (
    <div className="resources-container">
      <div className="resources-header">
        <h2>
          Learning Resources
          {topic && (
            <span className="topic-badge">{topic}</span>
          )}
        </h2>
        <p className="subtitle">
          {topic ? `Recommended resources for ${topic} in ${skill}` : `All resources for learning ${skill}`}
        </p>
      </div>

      <div className="resources-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <FaFilter className="filter-icon" />
          <select
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            className="resource-filter"
          >
            <option value="all">All Types</option>
            <option value="free">Free Resources</option>
            <option value="paid">Paid Courses</option>
            <option value="docs">Documentation</option>
          </select>
        </div>
      </div>

      <div className="resources-list">
        {filteredResources().length > 0 ? (
          filteredResources().map((resource, index) => (
            <div key={index} className="resource-card">
              <div className="resource-type">
                {getResourceIcon(resource.type)}
                <span className="type-label">
                  {resource.type === 'free' ? 'Free' : 
                   resource.type === 'paid' ? 'Premium' : 'Docs'}
                </span>
              </div>
              
              <div className="resource-content">
                <h3 className="resource-title">{resource.title}</h3>
                {resource.source && (
                  <p className="resource-source">{resource.source}</p>
                )}
                {resource.description && (
                  <p className="resource-description">{resource.description}</p>
                )}
              </div>

              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-link"
              >
                <FaExternalLinkAlt />
              </a>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No resources found matching your criteria.</p>
            <button 
              className="reset-filters"
              onClick={() => {
                setSearchQuery('');
                setResourceType('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;