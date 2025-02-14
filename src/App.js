import React, { useState, useRef } from 'react';
import DreamSpace from './components/DreamSpace';
import SearchPanel from './components/SearchPanel';

function App() {
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const dreamGraphRef = useRef(null);
  const [nodeNames, setNodeNames] = useState([]);

  const handleNodesChange = (newNodeNames) => {
    setNodeNames(newNodeNames);
  };

  const handleSearchComplete = (searchResults) => {
    console.log('Search results received in App:', searchResults);
    if (dreamGraphRef.current) {
      dreamGraphRef.current.displaySearchResults(searchResults);
    }
  };

  return (
    <>
      <div className="App">
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
    </>
  );
}

export default App;
