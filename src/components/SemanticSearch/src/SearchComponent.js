import React, { useState, useEffect, useCallback, useRef } from 'react';
import './SearchComponent.css';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import debounce from 'lodash/debounce';

function camelCaseToSentence(text) {
  return text.split(/(?=[A-Z])/).join(' ').toLowerCase();
}

function SearchComponent({ maxResults, threshold, targets, onSearchStart, onSearchComplete }) {
  const [input, setInput] = useState('');
  const [model, setModel] = useState(null);
  const [processedTargets, setProcessedTargets] = useState([]);
  const [originalNames, setOriginalNames] = useState({});
  const prevInputRef = useRef('');

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    processTargets(targets);
  }, [targets]);

  const loadModel = async () => {
    const loadedModel = await use.load();
    setModel(loadedModel);
  };

  const processTargets = (rawTargets) => {
    const processed = rawTargets.map(camelCaseToSentence);
    setProcessedTargets(processed);
    setOriginalNames(Object.fromEntries(rawTargets.map(target => [camelCaseToSentence(target), target])));
  };

  const cosineSimilarity = (a, b) => {
    const dotProduct = tf.sum(tf.mul(a, b));
    const normA = tf.norm(a);
    const normB = tf.norm(b);
    return dotProduct.div(tf.mul(normA, normB));
  };

  const handleSearch = useCallback(
    debounce(async (searchInput) => {
      if (searchInput.trim() && model && processedTargets.length > 0) {
        onSearchStart();
        try {
          const queryEmbedding = await model.embed(searchInput.trim());
          const targetEmbeddings = await model.embed(processedTargets);

          const similarities = tf.tidy(() => {
            const results = processedTargets.map((target, i) => {
              const similarity = cosineSimilarity(queryEmbedding, targetEmbeddings.slice([i, 0], [1, -1]));
              return [originalNames[target], similarity.dataSync()[0]];
            });
            let filteredResults = results.sort((a, b) => b[1] - a[1]);
            
            // Apply threshold filtering if set
            if (threshold !== null && threshold > 0) {
              filteredResults = filteredResults.filter(result => result[1] >= threshold);
            }
            
            // Apply max results limit if set
            if (maxResults !== null && maxResults > 0) {
              filteredResults = filteredResults.slice(0, maxResults);
            }
            
            return filteredResults;
          });

          onSearchComplete(similarities);
        } catch (error) {
          console.error('Error during search:', error);
          onSearchComplete([['Error', error.message]]);
        }
      }
    }, 300),
    [model, processedTargets, originalNames, maxResults, onSearchStart, onSearchComplete]
  );

  useEffect(() => {
    if (input.trim() && input !== prevInputRef.current) {
      handleSearch(input);
      prevInputRef.current = input;
    }
  }, [input, handleSearch]);

  return (
    <div className="search-component">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search..."
        className="search-input"
      />
    </div>
  );
}

export default SearchComponent;
