import React from 'react';
import './styles/NavigationBar.css';

interface NavigationBarProps {
  onHome: () => void;
  onBack: () => void;
  onRecent: () => void;
  visible: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onHome, onBack, onRecent, visible }) => {
  if (!visible) return null;

  return (
    <div className="navigation-bar">
      <button className="nav-btn" onClick={onBack}>
        <svg viewBox="0 0 24 24" className="nav-icon">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </button>
      <button className="nav-btn home-btn" onClick={onHome}>
        <div className="home-indicator"></div>
      </button>
      <button className="nav-btn" onClick={onRecent}>
        <svg viewBox="0 0 24 24" className="nav-icon">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        </svg>
      </button>
    </div>
  );
};

export default NavigationBar;
