import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import SearchBar from '../../components/core/SearchBar/SearchBar';
import PracticeNowBanner from '../../components/anti-tutorial-hell/PracticeNowBanner/PracticeNowBanner';
import { FaFire, FaGraduationCap, FaStar } from 'react-icons/fa';
import DonateButton from './DonateButton';

const Home = () => {
  const navigate = useNavigate();
  const [trendingSkills] = useState([
    { name: 'React', category: 'Frontend', growth: '24%' },
    { name: 'Python', category: 'Backend', growth: '18%' },
    { name: 'Rust', category: 'Systems', growth: '42%' },
    { name: 'Three.js', category: '3D', growth: '31%' }
  ]);

  const [successStories] = useState([
    { user: 'SarahK', skill: 'React', project: 'Built a portfolio site in 2 weeks' },
    { user: 'DevMike', skill: 'Node.js', project: 'Created a REST API for his startup' },
    { user: 'CodeJill', skill: 'Python', project: 'Automated her work tasks with scripts' }
  ]);

  const handleSkillClick = (skillName) => {
    navigate(`/roadmap/${encodeURIComponent(skillName.toLowerCase())}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/roadmap/${encodeURIComponent(searchQuery.toLowerCase())}`);
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">TutorialHeaven</h1>
        <p className="hero-subtitle">
          Escape Tutorial Hell!
        </p>
        <p className="hero-subtitle">
          Stop watching, start building. Get structured roadmaps to turn tutorials into real skills.
        </p>
        
        <div className="search-container">
          <SearchBar />
        </div>
        <div className="hero-subtitle">
            <DonateButton />
        </div>
      </section>

      {/* Practice Banner */}
      <PracticeNowBanner skill="JavaScript" />

      {/* Trending Skills */}
      <section className="trending-section">
        <h2 className="section-title">
          <FaFire className="section-icon" />
          Trending Skills
        </h2>
        <div className="skills-grid">
          {trendingSkills.map((skill, index) => (
            <div 
              key={index} 
              className="skill-card"
              onClick={() => handleSkillClick(skill.name)}
              style={{ cursor: 'pointer' }}
            >
              <h3>{skill.name}</h3>
              <p className="skill-category">{skill.category}</p>
              <p className="skill-growth">+{skill.growth}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories */}
      <section className="stories-section">
        <h2 className="section-title">
          <FaStar className="section-icon" />
          Success Stories
        </h2>
        <div className="stories-grid">
          {successStories.map((story, index) => (
            <div key={index} className="story-card">
              <div className="story-header">
                <div className="avatar-placeholder">@{story.user.charAt(0)}</div>
                <div>
                  <h4>@{story.user}</h4>
                  <p className="story-skill">Learned {story.skill}</p>
                </div>
              </div>
              <p className="story-project">
                <FaGraduationCap className="project-icon" />
                {story.project}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How TutorialHeaven Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Search a Skill</h3>
            <p>Find what you want to learn - programming, design, languages, etc.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Get a Roadmap</h3>
            <p>Receive a structured learning path tailored to your skill level.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Build Projects</h3>
            <p>Apply what you learn with curated project ideas at each step.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;