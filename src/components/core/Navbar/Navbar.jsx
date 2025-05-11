import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  BellIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      
      <div className="nav-actions">
        <button className="nav-btn">
          <BellIcon className="nav-icon" />
        </button>
        
        <button className="nav-btn">
          <EnvelopeIcon className="nav-icon" />
        </button>
        
        <Link to="/profile" className="profile-btn">
          <UserCircleIcon className="profile-icon" />
          <span>Learner</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;