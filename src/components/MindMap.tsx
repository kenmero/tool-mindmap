import React, { useEffect, useState } from 'react';
import ReactFlow, {
    Background,
    Controls,
    type Node,
    type Edge,
    Handle,
    Position,
    useNodesState,
    useEdgesState,
    MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { type ToolNodeData, toolsData, initialEdges, fetchToolsForKeyword } from '../data/tools';
import { ToolCard } from './ToolCard';

interface MindMapProps {
    searchQuery: string;
}

// Custom Node wrapper for ToolCard
const ToolCardNode = ({ data }: { data: ToolNodeData & { isHighlighted: boolean } }) => {
    return (
        <>
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            <ToolCard data={data} isHighlighted={data.isHighlighted} />
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </>
    );
};

// Root Node
const RootNode = ({ data }: { data: { label: string } }) => {
    return (
        <>
            <div className="glass-panel" style={{
                padding: '20px 40px',
                borderRadius: 'var(--radius-full)',
                border: '2px solid var(--accent-primary)',
                background: 'rgba(99, 102, 241, 0.15)',
                boxShadow: 'var(--shadow-neon)',
                textAlign: 'center'
            }}>
                <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem' }}>{data.label || 'AI Tool Universe'}</h2>
            </div>
            <Handle type="source" position={Position.Bottom} style={{ background: '#555', opacity: 0 }} />
        </>
    );
};

// Category Node
const CategoryNode = ({ data }: { data: { label: string, color: string } }) => {
    return (
        <>
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            <div style={{
                padding: '10px 24px',
                borderRadius: 'var(--radius-full)',
                border: `2px solid ${data.color}`,
                background: `${data.color}20`,
                color: 'white',
                fontWeight: 'bold',
                backdropFilter: 'blur(8px)',
                boxShadow: `0 0 15px ${data.color}40`,
            }}>
                {data.label}
            </div>
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
        </>
    );
};

const nodeTypes = {
    toolCard: ToolCardNode,
    rootNode: RootNode,
    categoryNode: CategoryNode,
};

export const MindMap: React.FC<MindMapProps> = ({ searchQuery }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch and generate layout dynamically
    useEffect(() => {
        let isMounted = true;

        const loadDynamicMap = async () => {
            setIsLoading(true);
            try {
                const data = await fetchToolsForKeyword(searchQuery);
                if (!isMounted) return;

                const newNodes: Node[] = [];
                const newEdges: Edge[] = [];

                if (!searchQuery.trim()) {
                    // --- Default Static Layout ---
                    const categories = Array.from(new Set(toolsData.map(t => t.category)));

                    newNodes.push({
                        id: 'root',
                        type: 'rootNode',
                        position: { x: window.innerWidth / 2 - 120, y: 50 },
                        data: { label: 'AI Tool Universe' }
                    });

                    const categoryColors: Record<string, string> = {
                        'LLM': '#6366f1',
                        'Agent': '#14b8a6',
                        'Observability': '#ec4899',
                        'Prompting': '#f59e0b',
                        'Development': '#8b5cf6',
                    };

                    const catSpacing = 400;
                    const startX = window.innerWidth / 2 - ((categories.length - 1) * catSpacing) / 2;

                    categories.forEach((cat, index) => {
                        const catId = `cat-${cat}`;
                        newNodes.push({
                            id: catId,
                            type: 'categoryNode',
                            position: { x: startX + index * catSpacing - 50, y: 200 },
                            data: { label: cat, color: categoryColors[cat] || '#ffffff' }
                        });

                        newEdges.push({
                            id: `e-root-${catId}`,
                            source: 'root',
                            target: catId,
                            animated: true,
                            style: { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 },
                        });
                    });

                    const toolsByCategory: Record<string, ToolNodeData[]> = {};
                    toolsData.forEach(t => {
                        if (!toolsByCategory[t.category]) toolsByCategory[t.category] = [];
                        toolsByCategory[t.category].push(t);
                    });

                    categories.forEach((cat, index) => {
                        const catId = `cat-${cat}`;
                        const tools = toolsByCategory[cat];

                        tools.forEach((tool, tIndex) => {
                            newNodes.push({
                                id: tool.id,
                                type: 'toolCard',
                                position: {
                                    x: startX + index * catSpacing - 140,
                                    y: 350 + tIndex * 260
                                },
                                data: { ...tool, isHighlighted: false }
                            });

                            newEdges.push({
                                id: `e-${catId}-${tool.id}`,
                                source: catId,
                                target: tool.id,
                                style: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 },
                                markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,255,255,0.2)' }
                            });
                        });
                    });

                    initialEdges.forEach(edge => {
                        newEdges.push({
                            id: edge.id,
                            source: edge.source,
                            target: edge.target,
                            label: edge.label,
                            labelStyle: { fill: '#fff', fontSize: 12, fontWeight: 'bold' },
                            labelBgStyle: { fill: '#333', opacity: 0.8, rx: 4 },
                            animated: true,
                            style: { stroke: 'var(--accent-primary)', strokeWidth: 2 },
                        });
                    });

                } else {
                    // --- Dynamic Search Layout ---
                    // The first node is designed as the root for search
                    const rootNodeInfo = data.tools[0];
                    if (rootNodeInfo) {
                        newNodes.push({
                            id: rootNodeInfo.id,
                            type: 'rootNode',
                            position: { x: window.innerWidth / 2 - 150, y: 80 },
                            data: { label: rootNodeInfo.name }
                        });

                        // Layout children horizontally beneath the root
                        const children = data.tools.slice(1);
                        const spacing = 350;
                        const startX = window.innerWidth / 2 - ((children.length - 1) * spacing) / 2 - 140;

                        children.forEach((tool, index) => {
                            newNodes.push({
                                id: tool.id,
                                type: 'toolCard',
                                position: {
                                    x: startX + index * spacing,
                                    y: 280 + (index % 2 === 0 ? 0 : 50) // Slight stagger
                                },
                                data: { ...tool, isHighlighted: true } // Highlight matched tools
                            });
                        });

                        data.edges.forEach((edge, i) => {
                            newEdges.push({
                                ...edge,
                                id: edge.id || `dyn-e-${i}`,
                                source: edge.source,
                                target: edge.target,
                                label: edge.label,
                                labelStyle: { fill: '#fff', fontSize: 12, fontWeight: 'bold' },
                                labelBgStyle: { fill: '#333', opacity: 0.8, rx: 4 },
                                animated: true,
                                style: { stroke: 'var(--accent-primary)', strokeWidth: 2 },
                                markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--accent-primary)' }
                            });
                        });
                    }
                }

                setNodes(newNodes);
                setEdges(newEdges);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            loadDynamicMap();
        }, 300); // 300ms debounce

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [searchQuery, setNodes, setEdges]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {isLoading && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(10, 10, 15, 0.6)', backdropFilter: 'blur(4px)', zIndex: 10
                }}>
                    <div style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', animation: 'pulseGlow 1.5s infinite' }}>
                        Generating Map...
                    </div>
                </div>
            )}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2, duration: 800 }}
                minZoom={0.2}
                defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            >
                <Background color="rgba(255, 255, 255, 0.05)" gap={16} size={0.5} />
                <Controls showInteractive={false} />
            </ReactFlow>
        </div>
    );
};
