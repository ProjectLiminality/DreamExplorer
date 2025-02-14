import React from 'react';
import '../styles/LiminalOverlay.css';

const LiminalOverlay = ({ onEnter }) => {
  return (
    <div className="liminal-overlay">
      <button onClick={onEnter}>Enter Liminal Space</button>
    </div>
  );
};

export default LiminalOverlay;
