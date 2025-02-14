import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { TextureLoader, Vector2 } from 'three';
import '../styles/LiminalOverlay.css';

const TiltingIcon = ({ onEnter, onHover }) => {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useLoader(TextureLoader, `${process.env.PUBLIC_URL}/favicon.png`);
  const { size } = useThree();
  const mouse = useRef(new Vector2());

  const { scale, tiltFactor } = useSpring({
    scale: hovered ? [5, 5, 5] : [4.5, 4.5, 4.5],
    tiltFactor: hovered ? 0 : 1,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame(() => {
    if (mesh.current) {
      const targetRotationX = (-mouse.current.y * Math.PI) / 10;
      const targetRotationY = (mouse.current.x * Math.PI) / 10;
      
      mesh.current.rotation.x += (targetRotationX * tiltFactor.get() - mesh.current.rotation.x) * 0.1;
      mesh.current.rotation.y += (targetRotationY * tiltFactor.get() - mesh.current.rotation.y) * 0.1;
    }
  });

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
