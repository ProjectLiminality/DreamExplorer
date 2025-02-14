import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Billboard, Html } from '@react-three/drei';
import gsap from 'gsap';
import DreamTalk from './DreamTalk';
import DreamSong from './DreamSong';
import { BLUE, RED } from '../constants/colors';
import { useThree } from '@react-three/fiber';

const DreamNode = ({ repoName, position, scale, metadata, dreamTalkMedia, dreamSongMedia, onNodeClick, onHover, isCentered }) => {
  const { camera } = useThree();
  const firstDreamSongMedia = dreamSongMedia && dreamSongMedia.length > 0 ? dreamSongMedia[0] : null;
  const [hovered, setHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const nodeRef = useRef();
  const groupRef = useRef();

  const handleFlip = useCallback(() => {
    setIsFlipped(prevState => {
      const newState = !prevState;
      gsap.to(groupRef.current.rotation, {
        y: newState ? Math.PI : 0,
        duration: 1,
        ease: "power2.inOut"
      });
      return newState;
    });
  }, []);

  useEffect(() => {
    if (!isCentered && isFlipped) {
      handleFlip();
    }
  }, [isCentered, isFlipped, handleFlip]);

  useEffect(() => {
    if (!isCentered) {
      setIsFlipped(false);
      gsap.to(groupRef.current.rotation, {
        y: 0,
        duration: 1,
        ease: "power2.inOut"
      });
    }
  }, [isCentered]);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  useEffect(() => {
    if (nodeRef.current) {
      gsap.to(nodeRef.current.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: 2,
        ease: "power2.inOut"
      });
      gsap.to(nodeRef.current.scale, {
        x: scale,
        y: scale,
        z: scale,
        duration: .5,
        ease: "power2.out"
      });
    }
  }, [position, scale]);

  const borderColor = metadata?.type === 'person' ? RED : BLUE;

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    onHover(repoName);
  }, [repoName, onHover]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    onHover(null);
  }, [repoName, onHover]);

  const handleClick = (clickedRepoName) => {
    onNodeClick(clickedRepoName || repoName);
  };


  return (
    <Billboard
      ref={nodeRef}
      follow={true}
      lockX={false}
      lockY={false}
      lockZ={false}
    >
      <group ref={groupRef}>
        <Html
          transform
          position={[0, 0, 0.01]}
          style={{
            width: '300px',
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <DreamTalk 
            repoName={repoName}
            dreamTalkMedia={dreamTalkMedia}
            metadata={metadata}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            isHovered={hovered}
            borderColor={borderColor}
            onFlip={handleFlip}
          />
        </Html>
        <Html
          transform
          position={[0, 0, -0.01]}
          rotation={[0, Math.PI, 0]}
          style={{
            width: '300px',
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <DreamSong 
            repoName={repoName}
            dreamSongMedia={dreamSongMedia}
            metadata={metadata}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            isHovered={hovered}
            borderColor={borderColor}
            onFlip={handleFlip}
          />
        </Html>
      </group>
    </Billboard>
  );
};

export default DreamNode;
