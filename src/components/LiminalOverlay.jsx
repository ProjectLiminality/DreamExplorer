import React, { useState } from 'react';
import '../styles/LiminalOverlay.css';

const LiminalOverlay = ({ onEnter }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleEnter = () => {
    setIsVisible(false);
    setTimeout(() => {
      onEnter();
    }, 1000); // Wait for fade-out animation to complete
  };

  if (!isVisible) return null;

  return (
    <div className={`liminal-overlay ${isVisible ? 'visible' : 'hidden'}`}>
      <button onClick={handleEnter}>Enter Liminal Space</button>
    </div>
  );
};

export default LiminalOverlay;
