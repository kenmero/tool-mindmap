export type ToolCategory = 'LLM' | 'Agent' | 'Observability' | 'Prompting' | 'Development';

export interface ToolNodeData {
    id: string;
    name: string;
    category: ToolCategory;
    description: string;
    url: string;
    keywords: string[];
    icon?: string;
}

export const toolsData: ToolNodeData[] = [
    {
        id: 'claude-root',
        name: 'Claude Ecosystem',
        category: 'LLM',
        description: 'Tools and resources for Anthropic Claude.',
        url: 'https://anthropic.com/claude',
        keywords: ['claude', 'anthropic', 'llm'],
    },
    {
        id: 'cocoindex-code',
        name: 'cocoindex-code',
        category: 'Prompting',
        description: 'A tool to generate highly effective code context for Claude.',
        url: 'https://github.com/cocoindex-io/cocoindex-code',
        keywords: ['claude', 'prompt', 'context', 'code'],
    },
    {
        id: 'langchain',
        name: 'LangChain',
        category: 'Agent',
        description: 'Building applications with LLMs through composability.',
        url: 'https://github.com/langchain-ai/langchain',
        keywords: ['agent', 'llm', 'framework', 'chain'],
    },
    {
        id: 'langsmith',
        name: 'LangSmith',
        category: 'Observability',
        description: 'Developer platform that lets you debug, test, evaluate, and monitor LLM applications.',
        url: 'https://smith.langchain.com/',
        keywords: ['observability', 'monitoring', 'langchain', 'eval'],
    },
    {
        id: 'langfuse',
        name: 'Langfuse',
        category: 'Observability',
        description: 'Open source LLM engineering platform. Traces, evals, prompt management and metrics.',
        url: 'https://github.com/langfuse/langfuse',
        keywords: ['observability', 'monitoring', 'open-source', 'telemetry'],
    },
    {
        id: 'vercel-ai-sdk',
        name: 'Vercel AI SDK',
        category: 'Development',
        description: 'The AI Toolkit for TypeScript developers.',
        url: 'https://sdk.vercel.ai/docs',
        keywords: ['development', 'react', 'typescript', 'vercel'],
    },
    {
        id: 'autogen',
        name: 'AutoGen',
        category: 'Agent',
        description: 'A framework that enables development of LLM applications using multiple agents.',
        url: 'https://github.com/microsoft/autogen',
        keywords: ['agent', 'microsoft', 'multi-agent'],
    },
    {
        id: 'crewai',
        name: 'CrewAI',
        category: 'Agent',
        description: 'Framework for orchestrating role-playing, autonomous AI agents.',
        url: 'https://github.com/joaomdmoura/crewAI',
        keywords: ['agent', 'multi-agent', 'orchestration'],
    },
    {
        id: 'gemini-root',
        name: 'Google Gemini',
        category: 'LLM',
        description: 'Google\'s largest and most capable AI model.',
        url: 'https://gemini.google.com/',
        keywords: ['gemini', 'google', 'llm', 'multimodal'],
    },
    {
        id: 'gemini-api',
        name: 'Gemini API',
        category: 'Development',
        description: 'Build applications with Google\'s advanced AI models.',
        url: 'https://ai.google.dev/',
        keywords: ['gemini', 'api', 'google', 'development'],
    },
    {
        id: 'chatgpt-root',
        name: 'ChatGPT / OpenAI',
        category: 'LLM',
        description: 'Powerful conversational AI models by OpenAI.',
        url: 'https://chat.openai.com/',
        keywords: ['chatgpt', 'openai', 'llm', 'gpt-4'],
    }
];

// Definition of static edges to form a tree structure
export interface ToolEdge {
    id: string;
    source: string;
    target: string;
    label?: string;
}

export const initialEdges: ToolEdge[] = [
    { id: 'e-claude-coco', source: 'claude-root', target: 'cocoindex-code', label: 'context generation' },
    { id: 'e-langchain-smith', source: 'langchain', target: 'langsmith', label: 'monitoring' },
    { id: 'e-langchain-fuse', source: 'langchain', target: 'langfuse', label: 'alternative monitoring' },
    { id: 'e-gemini-api', source: 'gemini-root', target: 'gemini-api', label: 'developer access' },
];

export const fetchToolsForKeyword = async (keyword: string): Promise<{ tools: ToolNodeData[], edges: ToolEdge[] }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const lowerKeyword = keyword.toLowerCase().trim();
            if (!lowerKeyword) {
                // If empty, return a default overview
                resolve({ tools: toolsData, edges: initialEdges });
                return;
            }

            // Simple dynamic generator
            // Try to match existing data first
            const matchedTools = toolsData.filter(t =>
                t.keywords.some(k => k.toLowerCase().includes(lowerKeyword)) ||
                t.name.toLowerCase().includes(lowerKeyword) ||
                t.description.toLowerCase().includes(lowerKeyword)
            );

            if (matchedTools.length > 0) {
                const rootId = `search-${lowerKeyword}`;
                const tools = [
                    {
                        id: rootId,
                        name: `Search: ${keyword}`,
                        category: 'LLM' as ToolCategory,
                        description: `Tools matching "${keyword}"`,
                        url: '#',
                        keywords: [lowerKeyword]
                    },
                    ...matchedTools
                ];
                const edges: ToolEdge[] = matchedTools.map((t) => ({
                    id: `e-${rootId}-${t.id}`,
                    source: rootId,
                    target: t.id,
                    label: `matches`
                }));
                // Persist internal edges if both nodes exist
                initialEdges.forEach(e => {
                    if (matchedTools.find(t => t.id === e.source) && matchedTools.find(t => t.id === e.target)) {
                        edges.push(e);
                    }
                });
                resolve({ tools, edges });
            } else {
                // Generate completely fake dynamic data
                const rootId = `gen-${lowerKeyword}`;
                const tools: ToolNodeData[] = [
                    {
                        id: rootId,
                        name: `${keyword} Ecosystem`,
                        category: 'LLM',
                        description: `Dynamically generated root for ${keyword}`,
                        url: '#',
                        keywords: [lowerKeyword]
                    },
                    {
                        id: `${rootId}-tool1`,
                        name: `${keyword} Agent Builder`,
                        category: 'Agent',
                        description: `A tool to build agents for ${keyword}`,
                        url: 'https://github.com/search?q=' + keyword + '+agent',
                        keywords: [lowerKeyword, 'agent']
                    },
                    {
                        id: `${rootId}-tool2`,
                        name: `${keyword} Optimizer`,
                        category: 'Prompting',
                        description: `Optimize prompts for ${keyword} models`,
                        url: 'https://github.com/search?q=' + keyword + '+prompt',
                        keywords: [lowerKeyword, 'prompt']
                    },
                    {
                        id: `${rootId}-tool3`,
                        name: `${keyword} Tracker`,
                        category: 'Observability',
                        description: `Monitor and track ${keyword} usage`,
                        url: 'https://github.com/search?q=' + keyword + '+monitor',
                        keywords: [lowerKeyword, 'observability']
                    }
                ];
                const edges: ToolEdge[] = [
                    { id: `e1`, source: rootId, target: `${rootId}-tool1`, label: 'agent capability' },
                    { id: `e2`, source: rootId, target: `${rootId}-tool2`, label: 'prompting tool' },
                    { id: `e3`, source: rootId, target: `${rootId}-tool3`, label: 'monitoring tool' },
                ];
                resolve({ tools, edges });
            }
        }, 800); // simulate network delay
    });
};
