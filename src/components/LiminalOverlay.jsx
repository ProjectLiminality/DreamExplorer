import React from 'react';
import '../styles/LiminalOverlay.css';

const LiminalOverlay = ({ onEnter }) => {
  return (
    <div className="liminal-overlay">
      <img 
        src={`${process.env.PUBLIC_URL}/favicon.png`} 
        alt="Enter Liminal Space" 
        onClick={onEnter}
        className="liminal-icon"
      />
    </div>
  );
};

export default LiminalOverlay;
