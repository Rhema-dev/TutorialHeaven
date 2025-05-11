import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SearchBar from '../../components/core/SearchBar/SearchBar';
import { FaChevronDown, FaChevronRight, FaCheck, FaBook, FaVideo, FaLaptopCode, FaSearch, FaArrowLeft } from 'react-icons/fa';
import ResourceCard from '../../components/core/ResourceCard/ResourceCard';
import DeepSeekWidget from '../../components/core/DeepSeekWidget/DeepSeekWidget';
import PracticeNowBanner from '../../components/anti-tutorial-hell/PracticeNowBanner/PracticeNowBanner';
import './Roadmap.css';

const Roadmap = () => {
  const { skill } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [currentTopic, setCurrentTopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Use Vite's env variable

  const roadmapPrompt = `
    Generate a detailed learning roadmap for {skill}. The roadmap must be a JSON object with:
    - title: String (roadmap title)
    - description: String (brief overview)
    - steps: Array of step objects, each containing:
      - id: String (unique identifier, kebab-case)
      - title: String
      - description: String
      - resources: Array of resource objects (type: 'video'|'article'|'project', url: String)
      - steps: Array of sub-step objects (same structure, nested as needed)
    Ensure at least 3 main steps with 2-3 sub-steps each, and include relevant resources for each step. 
    Output only the JSON object wrapped in \`\`\`json\n...\n\`\`\`, with no other text, comments, or explanations.
  `;

  useEffect(() => {
    const fetchRoadmap = async () => {
      setLoading(true);
      try {
        if (!GEMINI_API_KEY) {
          throw new Error('Gemini API key is missing. Set VITE_GEMINI_API_KEY in .env');
        }

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: roadmapPrompt.replace('{skill}', skill),
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2000,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Gemini raw response:', JSON.stringify(data, null, 2)); // Debug log

        // Extract text from response
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
          throw new Error('No text content in Gemini response');
        }

        // Try parsing markdown code block
        let generatedRoadmap;
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          try {
            generatedRoadmap = JSON.parse(jsonMatch[1]);
          } catch (parseError) {
            console.error('JSON parse error:', parseError, 'Raw JSON:', jsonMatch[1]);
            throw new Error('Failed to parse JSON from markdown block');
          }
        } else {
          // Fallback: Try parsing raw response as JSON
          try {
            generatedRoadmap = JSON.parse(responseText);
          } catch (parseError) {
            console.error('Fallback JSON parse error:', parseError, 'Raw text:', responseText);
            throw new Error('Invalid JSON response from Gemini');
          }
        }

        setRoadmap(generatedRoadmap);

        // Expand first level by default
        const firstLevelExpanded = {};
        generatedRoadmap.steps.forEach(step => {
          firstLevelExpanded[step.id] = true;
        });
        setExpandedNodes(firstLevelExpanded);
      } catch (error) {
        console.error('Failed to generate roadmap:', error);
        setRoadmap({ title: `${skill} Learning Roadmap`, description: 'Failed to load roadmap', steps: [] });
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

  const filteredRoadmap = () => {
    if (!searchQuery || !roadmap) return roadmap;

    const query = searchQuery.toLowerCase();
    const filterNodes = (nodes) => {
      return nodes
        .map(node => ({
          ...node,
          steps: node.steps ? filterNodes(node.steps) : []
        }))
        .filter(node =>
          node.title.toLowerCase().includes(query) ||
          node.description?.toLowerCase().includes(query) ||
          (node.steps && node.steps.length > 0)
        );
    };

    return {
      ...roadmap,
      steps: filterNodes(roadmap.steps)
    };
  };

  const RoadmapNode = ({ node, depth = 0, isExpanded, onToggle, onSelect, isCurrent }) => {
    const hasChildren = node.steps && node.steps.length > 0;
    const resourceTypes = node.resources?.map(r => r.type) || [];

    return (
      <div
        className={`roadmap-node depth-${depth} ${isCurrent ? 'current' : ''}`}
        onClick={() => onSelect(node)}
      >
        <div
          className="node-header"
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) onToggle(node.id);
          }}
        >
          {hasChildren ? (
            isExpanded ? <FaChevronDown className="toggle-icon" /> : <FaChevronRight className="toggle-icon" />
          ) : (
            <div className="toggle-spacer" />
          )}
          <h4 className="node-title">{node.title}</h4>
          <div className="node-icons">
            {resourceTypes.includes('video') && <FaVideo className="resource-icon" title="Video resources available" />}
            {resourceTypes.includes('article') && <FaBook className="resource-icon" title="Reading materials available" />}
            {resourceTypes.includes('project') && <FaLaptopCode className="resource-icon" title="Project ideas available" />}
          </div>
        </div>

        {node.description && <p className="node-description">{node.description}</p>}

        {isExpanded && hasChildren && (
          <div className="node-children">
            {node.steps.map(childNode => (
              <RoadmapNode
                key={childNode.id}
                node={childNode}
                depth={depth + 1}
                isExpanded={expandedNodes[childNode.id]}
                onToggle={onToggle}
                onSelect={onSelect}
                isCurrent={currentTopic?.id === childNode.id}
              />
            ))}
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
    <div className="roadmap-container">
      <div className="roadmap-header">
        <button className="back-button" onClick={() => window.history.back()}>
          <FaArrowLeft /> Back
        </button>
        <h1>{roadmap?.title || `${skill} Learning Roadmap`}</h1>
        <p className="roadmap-description">{roadmap?.description || "Follow this structured path to master the topic"}</p>
      </div>

      <div className="search-container">
        <div className="search-input-container">
          <div className="search-container">
                    <SearchBar />
                  </div>
        </div>
      </div>

      <div className="roadmap-content">
        <div className="roadmap-tree">
          {filteredRoadmap()?.steps.map(node => (
            <RoadmapNode
              key={node.id}
              node={node}
              depth={0}
              isExpanded={expandedNodes[node.id]}
              onToggle={toggleNode}
              onSelect={handleTopicSelect}
              isCurrent={currentTopic?.id === node.id}
            />
          ))}
        </div>

        <div className="roadmap-resources">
          {currentTopic ? (
            <>
              <div className="current-topic-header">
                <h2>{currentTopic.title}</h2>
                {currentTopic.description && (
                  <p className="topic-description">
                    <FaBook className="description-icon" />
                    {currentTopic.description}
                  </p>
                )}
              </div>
              <PracticeNowBanner skill={skill} currentTopic={currentTopic.title} />
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

export default Roadmap;