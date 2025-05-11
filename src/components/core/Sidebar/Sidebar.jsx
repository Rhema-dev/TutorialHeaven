import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon,
  HashtagIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">🦉</span>
        <h1>TutorialHeaven</h1>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item">
          <HomeIcon className="nav-icon" />
          <span>Home</span>
        </NavLink>
        
        <NavLink to="/roadmap/react" className="nav-item">
          <HashtagIcon className="nav-icon" />
          <span>Explore</span>
        </NavLink>
        
        <NavLink to="/resources" className="nav-item">
          <BookOpenIcon className="nav-icon" />
          <span>Resources</span>
        </NavLink>
        
        <NavLink to="/saved" className="nav-item">
          <AcademicCapIcon className="nav-icon" />
          <span>Saved</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <button className="logout-btn">
          <ArrowLeftOnRectangleIcon className="nav-icon" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;