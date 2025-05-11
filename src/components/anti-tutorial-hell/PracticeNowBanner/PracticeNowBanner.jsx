import React, { useState, useEffect, useRef } from 'react';
import './PracticeNowBanner.css';
import { FaLightbulb, FaTimes, FaRandom, FaPause, FaPlay } from 'react-icons/fa';

const PracticeNowBanner = ({ skill, currentTopic }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [projectIdeas, setProjectIdeas] = useState([]);
  const [currentIdea, setCurrentIdea] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [fade, setFade] = useState(false);
  const intervalRef = useRef(null);

  const IDEAS_DATABASE = {
  react: [
    "Build a personal journal app with mood tracking",
    "Create a community recipe sharing platform",
    "Develop a habit tracker with progress visualization",
    "Make a local event discovery app",
    "Build a collaborative whiteboard tool",
    "Create a minimalist blogging platform",
    "Develop a language learning flashcard app",
    "Build a workout planner with exercise demos",
    "Create a book recommendation engine",
    "Make a travel packing checklist app"
  ],
  javascript: [
    "Develop a browser-based audio mixer",
    "Create an interactive resume/portfolio",
    "Build a browser game like Tetris or Snake",
    "Make a meditation timer with nature sounds",
    "Develop a personality quiz generator",
    "Create a virtual plant care simulator",
    "Build a browser-based music instrument",
    "Make a daily gratitude journal app",
    "Develop a local business directory",
    "Create an interactive timeline of historical events"
  ],
  python: [
    "Build a personal finance tracker",
    "Create a meal planner with nutrition tracking",
    "Develop a job application tracker",
    "Make a reading list organizer with reviews",
    "Build a contacts management system",
    "Create a local community bulletin board",
    "Develop a movie watchlist with recommendations",
    "Make a gardening planner with plant care tips",
    "Build a skill progress tracker",
    "Create a personal knowledge management system"
  ],
  softSkills: [
    "Record yourself explaining a concept in simple terms",
    "Create a presentation about what you've learned",
    "Write a tutorial blog post for beginners",
    "Participate in a mock interview session",
    "Join a study group and teach a concept",
    "Create a mind map of related concepts",
    "Develop a personal learning roadmap",
    "Practice explaining to a non-technical friend",
    "Create flashcards for key concepts",
    "Record a short demo video of something you built"
  ],
  collaboration: [
    "Find an open-source project to document",
    "Contribute to documentation improvements",
    "Participate in a hackathon",
    "Join a coding challenge platform",
    "Pair program with someone learning the same skill",
    "Create a study group project",
    "Volunteer to build something for a local non-profit",
    "Collaborate on a community learning project",
    "Participate in a bug bounty program",
    "Contribute to an accessibility-focused project"
  ],
  creative: [
    "Remix an existing project with your own twist",
    "Create a visual representation of what you learned",
    "Build something inspired by your hobbies",
    "Combine two unrelated concepts into one project",
    "Create an analog version before digital (paper prototypes)",
    "Make a physical project related to your learning",
    "Design a poster summarizing key concepts",
    "Create a comic explaining a technical concept",
    "Build something for a specific community you're part of",
    "Develop a project that solves a personal pain point"
  ],
  reflection: [
    "Journal about your learning journey",
    "Create a 'lessons learned' document",
    "Build a progress timeline of your skills",
    "Make a video diary of your learning process",
    "Write thank-you notes to helpful resources",
    "Create a 'skills radar' chart of your abilities",
    "Develop a personal feedback system",
    "Build a 'mistakes I made' knowledge base",
    "Create a 'what I wish I knew earlier' guide",
    "Make a visualization of your learning network"
  ],
  default: [
    "Recreate a small feature you've learned about",
    "Teach the concept to someone else (rubber duck method)",
    "Find an open-source project to contribute to",
    "Build a tiny version of a complex app",
    "Create a cheatsheet for future reference",
    "Make a list of real-world applications",
    "Find three different ways to solve the same problem",
    "Build something without tutorials (just documentation)",
    "Create a 'how to get started' guide",
    "Make a list of common mistakes and fixes"
  ]
};
  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentIdea(prevIdea => {
          const currentIndex = projectIdeas.indexOf(prevIdea);
          const nextIndex = (currentIndex + 1) % projectIdeas.length;
          return projectIdeas[nextIndex];
        });
        setFade(false);
      }, 500); // Match this with CSS transition duration
    }, 4000);
  };

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    // Get relevant project ideas
    const skillIdeas = IDEAS_DATABASE[skill.toLowerCase()] || IDEAS_DATABASE.default;
    const topicIdeas = currentTopic 
      ? [...skillIdeas, `Practice by building something using ${currentTopic}`]
      : skillIdeas;
    
    setProjectIdeas(topicIdeas);
    setCurrentIdea(topicIdeas[Math.floor(Math.random() * topicIdeas.length)]);
  }, [skill, currentTopic]);

  useEffect(() => {
    if (projectIdeas.length > 0 && isPlaying) {
      startInterval();
    }
    return () => stopInterval();
  }, [projectIdeas, isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getNewIdea = () => {
    stopInterval();
    setFade(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * projectIdeas.length);
      setCurrentIdea(projectIdeas[randomIndex]);
      setFade(false);
      if (isPlaying) {
        startInterval();
      }
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div className="practice-banner">
      <div className="banner-content">
        <FaLightbulb className="idea-icon" />
        <div className="idea-text">
          <h3>Stop Watching, Start Building!</h3>
          <p>
            Practice now: 
            <span className={`idea ${fade ? 'fade-out' : 'fade-in'}`}>
              {currentIdea}
            </span>
          </p>
        </div>
      </div>
      
      <div className="banner-actions">
        <button 
          className="control-btn"
          onClick={togglePlayPause}
          title={isPlaying ? 'Pause rotation' : 'Play rotation'}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button 
          className="control-btn"
          onClick={getNewIdea}
          title="Get random project idea"
        >
          <FaRandom />
        </button>
        <button 
          className="control-btn dismiss-btn"
          onClick={() => setIsVisible(false)}
          title="Dismiss"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default PracticeNowBanner;