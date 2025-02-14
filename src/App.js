import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import DreamSpace from './components/DreamSpace';
import SearchPanel from './components/SearchPanel';
import LandingPage from './components/LandingPage';

function App() {
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const dreamGraphRef = useRef(null);
  const [nodeNames, setNodeNames] = useState([]);
  const [readmeContent, setReadmeContent] = useState('');

  useEffect(() => {
    fetch('README.md')
      .then(response => response.text())
      .then(text => setReadmeContent(text))
      .catch(error => console.error('Error fetching README:', error));
  }, []);

  const handleNodesChange = (newNodeNames) => {
    setNodeNames(newNodeNames);
  };

  const handleSearchComplete = (searchResults) => {
    console.log('Search results received in App:', searchResults);
    if (dreamGraphRef.current) {
      dreamGraphRef.current.displaySearchResults(searchResults);
    }
  };

  const handleKeyDown = useCallback((event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'f') {
      event.preventDefault();
      setIsSearchPanelOpen(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="App">
      <div className="dream-space-container" style={{ height: '100vh', width: '100vw' }}>
        <DreamSpace 
          dreamGraphRef={dreamGraphRef}
          onHover={(repoName) => console.log('Hovered node:', repoName)}
          onNodesChange={handleNodesChange}
        />
      </div>
      <SearchPanel
        isOpen={isSearchPanelOpen}
        onSearch={handleSearchComplete}
        onClose={() => setIsSearchPanelOpen(false)}
        repoNames={nodeNames}
        threshold={0.5}
        style={{
          position: 'fixed',
          top: '0%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000
        }}
      />
      <LandingPage content={readmeContent} />
    </div>
  );
}

export default App;
