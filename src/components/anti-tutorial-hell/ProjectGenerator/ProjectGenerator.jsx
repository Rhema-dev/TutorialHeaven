import React, { useState, useEffect } from 'react';
import './ProjectGenerator.css';
import { FaRandom, FaBookmark, FaExternalLinkAlt, FaSeedling, FaRocket, FaBrain } from 'react-icons/fa';

const ProjectGenerator = ({ skill, currentTopic, difficulty = 'all' }) => {
  const [currentProject, setCurrentProject] = useState(null);
  const [savedProjects, setSavedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Comprehensive project database
  const PROJECTS_DATABASE = {
    react: {
      beginner: [
        {
          title: "Todo List with Categories",
          description: "Build a todo app that allows organizing tasks into different categories",
          requirements: ["useState", "Component composition"],
          resources: [
            { type: 'example', url: 'https://github.com/example/todo-app' },
            { type: 'tutorial', url: 'https://youtube.com/watch?v=react-todo' }
          ]
        },
        {
          title: "Movie Search App",
          description: "Create an app that searches movies using the OMDB API",
          requirements: ["useEffect", "API calls"],
          resources: []
        }
      ],
      intermediate: [
        {
          title: "E-commerce Product Page",
          description: "Build a product page with cart functionality",
          requirements: ["useReducer", "Context API"],
          resources: []
        }
      ],
      advanced: [
        {
          title: "Real-time Collaborative Editor",
          description: "Create a document editor with live collaboration",
          requirements: ["WebSockets", "Operational Transform"],
          resources: []
        }
      ]
    },
    javascript: {
      beginner: [
        {
          title: "Weather App",
          description: "Display weather data from a public API",
          requirements: ["fetch API", "DOM manipulation"],
          resources: []
        }
      ]
    }
  };

  useEffect(() => {
    const loadProjects = () => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const skillProjects = PROJECTS_DATABASE[skill.toLowerCase()] || PROJECTS_DATABASE.javascript;
        let projects = [];
        
        // Filter by difficulty
        if (difficulty === 'all') {
          projects = [
            ...(skillProjects.beginner || []),
            ...(skillProjects.intermediate || []),
            ...(skillProjects.advanced || [])
          ];
        } else {
          projects = skillProjects[difficulty] || [];
        }
        
        // Add topic-specific project if available
        if (currentTopic) {
          projects.push({
            title: `Practice: ${currentTopic}`,
            description: `Build a small project focusing on ${currentTopic}`,
            requirements: [currentTopic],
            isCustom: true
          });
        }
        
        setCurrentProject(projects[Math.floor(Math.random() * projects.length)]);
        setIsLoading(false);
      }, 800);
    };
    
    loadProjects();
  }, [skill, currentTopic, difficulty]);

  const generateNewProject = () => {
    const skillProjects = PROJECTS_DATABASE[skill.toLowerCase()] || PROJECTS_DATABASE.javascript;
    let projects = [];
    
    if (difficulty === 'all') {
      projects = [
        ...(skillProjects.beginner || []),
        ...(skillProjects.intermediate || []),
        ...(skillProjects.advanced || [])
      ];
    } else {
      projects = skillProjects[difficulty] || [];
    }
    
    setCurrentProject(projects[Math.floor(Math.random() * projects.length)]);
  };

  const saveProject = () => {
    if (currentProject && !savedProjects.some(p => p.title === currentProject.title)) {
      setSavedProjects([...savedProjects, currentProject]);
    }
  };

  if (isLoading) {
    return (
      <div className="project-generator loading">
        <div className="spinner"></div>
        <p>Generating project ideas...</p>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="project-generator empty">
        <p>No projects found for {skill}. Try another skill or difficulty.</p>
      </div>
    );
  }

  return (
    <div className="project-generator">
      <div className="project-header">
        <h3>
          {currentProject.isCustom ? (
            <FaSeedling className="project-icon custom-icon" />
          ) : difficulty === 'beginner' ? (
            <FaSeedling className="project-icon beginner-icon" />
          ) : difficulty === 'advanced' ? (
            <FaRocket className="project-icon advanced-icon" />
          ) : (
            <FaBrain className="project-icon intermediate-icon" />
          )}
          {currentProject.title}
        </h3>
        
        <div className="project-actions">
          <button 
            onClick={generateNewProject}
            className="generate-btn"
            title="Generate new project"
          >
            <FaRandom />
          </button>
          <button 
            onClick={saveProject}
            className="save-btn"
            title="Save this project"
            disabled={savedProjects.some(p => p.title === currentProject.title)}
          >
            <FaBookmark />
          </button>
        </div>
      </div>
      
      <div className="project-content">
        <p className="project-description">{currentProject.description}</p>
        
        {currentProject.requirements?.length > 0 && (
          <div className="project-requirements">
            <h4>Skills you'll practice:</h4>
            <ul>
              {currentProject.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}
        
        {currentProject.resources?.length > 0 && (
          <div className="project-resources">
            <h4>Helpful resources:</h4>
            <ul>
              {currentProject.resources.map((resource, i) => (
                <li key={i}>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {resource.type === 'example' ? 'Example Code' : 'Tutorial'}
                    <FaExternalLinkAlt className="external-icon" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {savedProjects.length > 0 && (
        <div className="saved-projects">
          <h4>Your Saved Projects:</h4>
          <ul>
            {savedProjects.map((project, i) => (
              <li key={i} onClick={() => setCurrentProject(project)}>
                {project.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectGenerator;