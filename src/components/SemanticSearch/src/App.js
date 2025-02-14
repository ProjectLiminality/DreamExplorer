import React, { useState, useEffect } from 'react';
import SearchComponent from './SearchComponent';
import './App.css';
const { ipcRenderer } = window.require('electron');

function App() {
  const [directoryPath, setDirectoryPath] = useState('');
  const [maxResults, setMaxResults] = useState(null);
  const [threshold, setThreshold] = useState(0.5);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [targets, setTargets] = useState([]);

  useEffect(() => {
    ipcRenderer.invoke('read-file', 'config.json')
      .then(JSON.parse)
      .then(config => {
        setDirectoryPath(config.directoryPath);
        loadTargets(config.directoryPath);
      })
      .catch(console.error);
  }, []);

  const loadTargets = async (path) => {
    if (path) {
      try {
        const folders = await ipcRenderer.invoke('get-directory-folders', path);
        setTargets(folders);
      } catch (error) {
        console.error('Error loading targets:', error);
      }
    }
  };

  const handleDirectorySelect = async () => {
    const result = await ipcRenderer.invoke('select-directory');
    if (result) {
      setDirectoryPath(result);
      await ipcRenderer.invoke('write-file', 'config.json', JSON.stringify({ directoryPath: result }));
      loadTargets(result);
    }
  };

  const handleSearchComplete = (searchResults) => {
    setResults(searchResults);
    setIsSearching(false);
  };

  return (
    <div className="App">
      <h1>Semantic Search</h1>
      <div>
        <input
          type="text"
          value={directoryPath}
          readOnly
          placeholder="Select directory"
        />
        <button onClick={handleDirectorySelect}>Select Directory</button>
        <input
          type="number"
          value={maxResults === null ? '' : maxResults}
          onChange={(e) => {
            const value = e.target.value === '' ? null : Math.max(1, parseInt(e.target.value) || 1);
            setMaxResults(value);
          }}
          min="1"
          placeholder="Max results (optional)"
        />
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(Math.max(0, Math.min(1, parseFloat(e.target.value) || 0)))}
          min="0"
          max="1"
          step="0.01"
          placeholder="Threshold (0-1)"
        />
      </div>
      <SearchComponent 
        maxResults={maxResults} 
        threshold={threshold}
        targets={targets}
        onSearchStart={() => setIsSearching(true)}
        onSearchComplete={handleSearchComplete}
      />
      {isSearching ? (
        <p>Searching...</p>
      ) : (
        <div className="results">
          <h2>Results:</h2>
          {results.map(([name, similarity]) => (
            <div key={name} className="result-item">
              {name}: {similarity.toFixed(4)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
