import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { TextureLoader } from 'three';
import '../styles/LiminalOverlay.css';

const TiltingIcon = ({ onEnter, onHover }) => {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useLoader(TextureLoader, `${process.env.PUBLIC_URL}/favicon.png`);
  const { size } = useThree();

  const { scale, rotation } = useSpring({
    scale: hovered ? [5, 5, 5] : [4.5, 4.5, 4.5],
    rotation: hovered ? [0, 0, 0] : [0, 0, 0],
    config: { mass: 1, tension: 280, friction: 60 }
  });

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (mesh.current && !hovered) {
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
  }, [hovered]);

  return (
    <animated.mesh
      ref={mesh}
      onClick={onEnter}
      onPointerOver={() => {
        setHovered(true);
        onHover(true);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(false);
      }}
      scale={scale}
      rotation={rotation}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent />
    </animated.mesh>
  );
};

const LiminalOverlay = ({ onEnter }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="liminal-overlay">
      <Canvas style={{ width: '666px', height: '666px' }}>
        <TiltingIcon onEnter={onEnter} onHover={setIsHovered} />
      </Canvas>
      <div className={`hover-text ${isHovered ? 'visible' : ''}`}>
        Enter liminal space
      </div>
    </div>
  );
};

export default LiminalOverlay;
