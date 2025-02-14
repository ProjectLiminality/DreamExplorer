import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { getRepoNames } from '../utils/fileUtils';

const SPHERE_RADIUS = 1000;

const useDreamNodes = (initialCount = 5) => {
  const [dreamNodes, setDreamNodes] = useState([]);
  const [error, setError] = useState(null);

  const fetchNodes = useCallback(async (count) => {
    try {
      console.log('Fetching DreamNodes...');
      const allRepos = getRepoNames();
      const availableCount = Math.min(count, allRepos.length);
      const selectedRepos = allRepos.slice(0, availableCount);
      
      console.log('Setting DreamNodes:', selectedRepos);
      const newNodes = selectedRepos.map((repo, index) => ({
        repoName: repo,
        position: calculateNodePosition(index, selectedRepos.length),
      }));
      
      setDreamNodes(newNodes);
    } catch (error) {
      console.error('Error fetching dream nodes:', error);
      setError('Error fetching dream nodes: ' + error.message);
    }
  }, []);

  const spawnNode = useCallback((repoName) => {
    console.log(`Attempting to spawn node: ${repoName}`);
    setDreamNodes(prevNodes => {
      if (prevNodes.some(node => node.repoName === repoName)) {
        console.log(`Node ${repoName} already exists. No action taken.`);
        return prevNodes;
      }
      const newNode = {
        repoName: repoName,
        position: calculateNodePosition(prevNodes.length, prevNodes.length + 1),
      };
      console.log(`Node spawned: ${repoName}`);
      return [...prevNodes, newNode];
    });
  }, []);

  useEffect(() => {
    fetchNodes(initialCount);
  }, [fetchNodes, initialCount]);

  return { dreamNodes, setDreamNodes, error, spawnNode };
};

const calculateNodePosition = (index, total) => {
  const phi = Math.acos(1 - 2 * (index + 1) / (total + 1));
  const theta = 2 * Math.PI * (index + 1) / ((1 + Math.sqrt(5)) / 2);
  const x = SPHERE_RADIUS * Math.sin(phi) * Math.cos(theta);
  const y = SPHERE_RADIUS * Math.sin(phi) * Math.sin(theta);
  const z = SPHERE_RADIUS * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

export default useDreamNodes;
