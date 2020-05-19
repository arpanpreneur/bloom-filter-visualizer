import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import BloomFilter from './components/BloomFilter';

function App() {

  return (
    <div>
      <header>
        <h2 style={{textAlign: 'center'}}>Bloom Filter Visualizer</h2>
        <hr/>
      </header>
      <BloomFilter />
    </div>
  );
}

export default App;
