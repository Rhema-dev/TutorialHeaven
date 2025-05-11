import React from 'react';
import './RoadmapNode.css';
import { FaChevronDown, FaChevronRight, FaCheck, FaBook, FaVideo, FaLaptopCode } from 'react-icons/fa';

const RoadmapNode = ({ 
  node, 
  depth = 0, 
  isExpanded, 
  onToggle, 
  onSelect,
  isCompleted,
  isCurrent 
}) => {
  const hasChildren = node.steps && node.steps.length > 0;
  const resourceTypes = node.resources?.map(r => r.type) || [];

  return (
    <div 
      className={`
        roadmap-node 
        depth-${depth} 
        ${isCurrent ? 'current' : ''}
        ${isCompleted ? 'completed' : ''}
      `}
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
          isExpanded ? (
            <FaChevronDown className="toggle-icon" />
          ) : (
            <FaChevronRight className="toggle-icon" />
          )
        ) : (
          <div className="toggle-spacer" />
        )}

        <h4 className="node-title">
          {isCompleted && <FaCheck className="completed-icon" />}
          {node.title}
        </h4>

        <div className="node-icons">
          {resourceTypes.includes('video') && <FaVideo className="resource-icon" title="Video resources available" />}
          {resourceTypes.includes('article') && <FaBook className="resource-icon" title="Reading materials available" />}
          {resourceTypes.includes('project') && <FaLaptopCode className="resource-icon" title="Project ideas available" />}
        </div>
      </div>

      {node.description && (
        <p className="node-description">{node.description}</p>
      )}

      {isExpanded && hasChildren && (
        <div className="node-children">
          {node.steps.map(childNode => (
            <RoadmapNode
              key={childNode.id}
              node={childNode}
              depth={depth + 1}
              isExpanded={isExpanded}
              onToggle={onToggle}
              onSelect={onSelect}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoadmapNode;