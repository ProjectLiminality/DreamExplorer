import React, { useState, useRef, useCallback } from 'react';
import './App.css';
import DreamSpace from './components/DreamSpace';
import SearchPanel from './components/SearchPanel';
import LandingPage from './components/LandingPage';
import LiminalOverlay from './components/LiminalOverlay';

function App() {
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const dreamGraphRef = useRef(null);
  const [nodeNames, setNodeNames] = useState([]);
  const [showDreamSpace, setShowDreamSpace] = useState(false);

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

  const handleEnterLiminalSpace = () => {
    setShowDreamSpace(true);
  };

  const handleExitLiminalSpace = () => {
    setShowDreamSpace(false);
  };

  return (
    <div className="App">
      {!showDreamSpace ? (
        <div className="two-dimensional-webpage">
          <LiminalOverlay onEnter={handleEnterLiminalSpace} />
          <LandingPage />
        </div>
      ) : (
        <div className="dream-space-container">
          <DreamSpace 
            dreamGraphRef={dreamGraphRef}
            onHover={(repoName) => console.log('Hovered node:', repoName)}
            onNodesChange={handleNodesChange}
            onExit={handleExitLiminalSpace}
          />
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
        </div>
      )}
    </div>
  );
}

export default App;
