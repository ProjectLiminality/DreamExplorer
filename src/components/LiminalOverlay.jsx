import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import '../styles/LiminalOverlay.css';

const TiltingIcon = ({ onEnter }) => {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useLoader(TextureLoader, `${process.env.PUBLIC_URL}/favicon.png`);
  const { size } = useThree();

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (mesh.current) {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        mesh.current.rotation.x = (-mouseY * Math.PI) / 10;
        mesh.current.rotation.y = (mouseX * Math.PI) / 10;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
