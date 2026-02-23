import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { MindMap } from './components/MindMap';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="app-container">
      <header className="app-header animate-enter" style={{ animationDelay: '0.1s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-neon)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div>
            <h1 className="text-gradient" style={{ margin: 0, fontSize: '1.5rem', lineHeight: 1.2 }}>Tool Mapping</h1>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI / LLM Ecosystem</p>
          </div>
        </div>

        <div style={{ flex: 1, padding: '0 2rem' }}>
          <SearchBar onSearch={setSearchQuery} />
        </div>

        {/* Empty div to balance the header flexbox layout */}
        <div style={{ width: '150px' }}></div>
      </header>

      <main className="main-content animate-enter" style={{ animationDelay: '0.2s' }}>
        <MindMap searchQuery={searchQuery} />
      </main>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '25px',
        zIndex: 10,
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }}></div>
        System Active
      </div>
    </div>
  );
}

export default App;
