import React from 'react';
import type { ToolNodeData } from '../data/tools';
import { ExternalLink, Tag } from 'lucide-react';

interface ToolCardProps {
    data: ToolNodeData;
    isHighlighted?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ data, isHighlighted }) => {
    // Utility for getting category color
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'LLM': return '#6366f1'; // Indigo
            case 'Agent': return '#14b8a6'; // Teal
            case 'Observability': return '#ec4899'; // Pink
            case 'Prompting': return '#f59e0b'; // Amber
            case 'Development': return '#8b5cf6'; // Violet
            default: return '#9ca3af'; // Gray
        }
    };

    const color = getCategoryColor(data.category);

    return (
        <div
            className="glass-panel"
            style={{
                padding: '16px',
                width: '280px',
                cursor: 'pointer',
                border: isHighlighted ? `2px solid ${color}` : '1px solid var(--border-glass)',
                boxShadow: isHighlighted ? `0 0 15px ${color}40` : 'var(--shadow-glass)',
                transform: isHighlighted ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
            onClick={() => window.open(data.url, '_blank')}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 10px 25px ${color}30, 0 0 15px ${color}50`;
                e.currentTarget.style.borderColor = color;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = isHighlighted ? 'scale(1.02)' : 'scale(1)';
                e.currentTarget.style.boxShadow = isHighlighted ? `0 0 15px ${color}40` : 'var(--shadow-glass)';
                e.currentTarget.style.borderColor = isHighlighted ? color : 'var(--border-glass)';
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{
                    margin: 0,
                    fontSize: '1.1rem',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    {data.name}
                </h3>
                <ExternalLink size={16} color="var(--text-muted)" />
            </div>

            <div style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: `${color}20`,
                color: color,
                fontSize: '0.75rem',
                fontWeight: 500,
                marginBottom: '12px'
            }}>
                {data.category}
            </div>

            <p style={{
                margin: '0 0 12px 0',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
            }}>
                {data.description}
            </p>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <Tag size={12} color="var(--text-muted)" style={{ marginTop: '2px' }} />
                {data.keywords.slice(0, 3).map((kw, i) => (
                    <span key={i} style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.7rem',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                    }}>
                        #{kw}
                    </span>
                ))}
            </div>
        </div>
    );
};
