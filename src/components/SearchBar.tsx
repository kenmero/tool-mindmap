import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    onSearch: (keyword: string) => void;
    placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Search for tools, features, or keywords (e.g., 'claude')" }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <div className="search-container" style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <form onSubmit={handleSubmit} className="glass-panel" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                transition: 'all 0.3s ease'
            }}>
                <Search size={20} color="var(--text-secondary)" style={{ marginRight: '12px' }} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        outline: 'none',
                        fontFamily: 'var(--font-inter)',
                    }}
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px',
                            borderRadius: '50%',
                            color: 'var(--text-secondary)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    >
                        <X size={18} />
                    </button>
                )}
            </form>
        </div>
    );
};
