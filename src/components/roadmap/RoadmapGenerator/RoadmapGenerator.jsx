import React, { useState, useEffect } from 'react';
import './RoadmapGenerator.css';
import ResourceCard from '../core/ResourceCard/ResourceCard';
import DeepSeekWidget from '../core/DeepSeekWidget/DeepSeekWidget';
import { useParams } from 'react-router-dom';
import { FaChevronDown, FaChevronRight, FaCheck, FaBook, FaVideo, FaLaptopCode } from 'react-icons/fa';

const RoadmapGenerator = () => {
  const { skill } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [currentTopic, setCurrentTopic] = useState(null);

  // Sample roadmap data structure
  const sampleRoadmaps = {
    react: {
      title: "React Mastery Roadmap",
      description: "Complete path to becoming proficient in React",
      steps: [
        {
          id: 'fundamentals',
          title: "Fundamentals",
          resources: [],
          steps: [
            {
              id: 'js-prerequisites',
              title: "JavaScript Prerequisites",
              description: "Learn essential JS concepts needed for React",
              resources: []
            },
            {
              id: 'react-basics',
              title: "React Basics",
              description: "Components, JSX, and rendering",
              resources: []
            }
          ]
        },
        {
          id: 'core-concepts',
          title: "Core Concepts",
          resources: [],
          steps: [
            {
              id: 'state-management',
              title: "State Management",
              description: "useState, useContext, and state patterns",
              resources: []
            },
            {
              id: 'hooks',
              title: "React Hooks",
              description: "Mastering useEffect, useMemo, useCallback, etc.",
              resources: []
            }
          ]
        }
      ]
    }
  };

  useEffect(() => {
    // Simulate API fetch
    const fetchRoadmap = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setRoadmap(sampleRoadmaps[skill.toLowerCase()] || sampleRoadmaps.react);
      } catch (error) {
        console.error("Failed to load roadmap:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [skill]);

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const handleTopicSelect = (topic) => {
    setCurrentTopic(topic);
  };

  const renderRoadmapNode = (node, depth = 0) => {
    const isExpanded = expandedNodes[node.id];
    const hasChildren = node.steps && node.steps.length > 0;

    return (
      <div 
        key={node.id} 
        className={`roadmap-node depth-${depth}`}
        onClick={() => handleTopicSelect(node)}
      >
        <div className="node-header" onClick={(e) => {
          e.stopPropagation();
          if (hasChildren) toggleNode(node.id);
        }}>
          {hasChildren ? (
            isExpanded ? <FaChevronDown className="toggle-icon" /> : <FaChevronRight className="toggle-icon" />
          ) : (
            <div className="toggle-spacer" />
          )}
          <h4 className="node-title">{node.title}</h4>
          <div className="node-icons">
            {node.resources?.some(r => r.type === 'video') && <FaVideo className="resource-icon" />}
            {node.resources?.some(r => r.type === 'article') && <FaBook className="resource-icon" />}
            {node.resources?.some(r => r.type === 'project') && <FaLaptopCode className="resource-icon" />}
          </div>
        </div>

        {node.description && (
          <p className="node-description">{node.description}</p>
        )}

        {isExpanded && hasChildren && (
          <div className="node-children">
            {node.steps.map(childNode => renderRoadmapNode(childNode, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Generating your {skill} learning roadmap...</p>
      </div>
    );
  }

  return (
    <div className="roadmap-generator-container">
      <div className="roadmap-header">
        <h2>{roadmap?.title || `${skill} Learning Roadmap`}</h2>
        <p className="roadmap-description">
          {roadmap?.description || "Follow this structured path to master the topic"}
        </p>
      </div>

      <div className="roadmap-content">
        <div className="roadmap-tree">
          {roadmap?.steps.map(node => renderRoadmapNode(node))}
        </div>

        <div className="roadmap-resources">
          {currentTopic ? (
            <>
              <div className="current-topic-header">
                <h3>{currentTopic.title}</h3>
                {currentTopic.description && (
                  <p className="topic-description">{currentTopic.description}</p>
                )}
              </div>
              <ResourceCard skill={skill} topic={currentTopic.id} />
              <DeepSeekWidget skill={skill} currentTopic={currentTopic.id} />
            </>
          ) : (
            <div className="select-topic-prompt">
              <p>Select a topic from the roadmap to view learning resources</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapGenerator;