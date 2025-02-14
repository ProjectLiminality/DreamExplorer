import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import '../styles/LiminalOverlay.css';

const TiltingIcon = ({ onEnter }) => {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useLoader(TextureLoader, `${process.env.PUBLIC_URL}/favicon.png`);

  useFrame(({ mouse }) => {
    if (mesh.current) {
      mesh.current.rotation.x = (-mouse.y * Math.PI) / 10; // Inverted y-axis
      mesh.current.rotation.y = (mouse.x * Math.PI) / 10;
    }
  });

  return (
    <mesh
      ref={mesh}
      onClick={onEnter}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? [6.66, 6.66, 6.66] : [5.55, 5.55, 5.55]}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
};

const LiminalOverlay = ({ onEnter }) => {
  return (
    <div className="liminal-overlay">
      <Canvas style={{ width: '1000px', height: '1000px' }}>
        <TiltingIcon onEnter={onEnter} />
      </Canvas>
    </div>
  );
};

export default LiminalOverlay;
