import React, { useState, useEffect, useRef, useCallback } from 'react';
import { problemsService } from '../../services/database';
import { Problem } from '../../types';
import { RefreshCw, ZoomIn, ZoomOut, Filter } from 'lucide-react';
import { colors } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';

interface Node {
  id: string;
  label: string;
  difficulty: string;
  tags: string[];
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Edge {
  source: string;
  target: string;
  strength: number;
}

const Graph: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTag, setSelectedTag] = useState('');
  const { theme } = useTheme();

  const generateGraph = useCallback(() => {
    let filteredProblems = problems;

    // Apply filters
    if (selectedDifficulty !== 'All') {
      filteredProblems = filteredProblems.filter(p => p.difficulty === selectedDifficulty);
    }
    if (selectedTag) {
      filteredProblems = filteredProblems.filter(p => 
        p.tags.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase()))
      );
    }

    // Create nodes
    const newNodes: Node[] = filteredProblems.map((problem, index) => ({
      id: problem.id,
      label: `${problem.number}. ${problem.title}`,
      difficulty: problem.difficulty,
      tags: problem.tags,
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      vx: 0,
      vy: 0,
    }));

    // Create edges based on shared tags
    const newEdges: Edge[] = [];
    for (let i = 0; i < newNodes.length; i++) {
      for (let j = i + 1; j < newNodes.length; j++) {
        const node1 = filteredProblems[i];
        const node2 = filteredProblems[j];
        const sharedTags = node1.tags.filter(tag => node2.tags.includes(tag));
        
        if (sharedTags.length > 0) {
          newEdges.push({
            source: node1.id,
            target: node2.id,
            strength: sharedTags.length,
          });
        }
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, [problems, selectedDifficulty, selectedTag, setNodes, setEdges]);

  const simulateForces = useCallback(() => {
    const alpha = 0.1;
    const repulsion = 100;
    const attraction = 0.01;

    setNodes(prevNodes => {
      const newNodesList = [...prevNodes]; // Renamed to avoid conflict with 'nodes' state

      // Reset forces
      newNodesList.forEach(node => {
        node.vx *= 0.9; // Damping
        node.vy *= 0.9;
      });

      // Repulsion between all nodes
      for (let i = 0; i < newNodesList.length; i++) {
        for (let j = i + 1; j < newNodesList.length; j++) {
          const dx = newNodesList[j].x - newNodesList[i].x;
          const dy = newNodesList[j].y - newNodesList[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsion / (distance * distance);
          
          newNodesList[i].vx -= (dx / distance) * force;
          newNodesList[i].vy -= (dy / distance) * force;
          newNodesList[j].vx += (dx / distance) * force;
          newNodesList[j].vy += (dy / distance) * force;
        }
      }

      // Attraction along edges
      edges.forEach(edge => {
        const source = newNodesList.find(n => n.id === edge.source);
        const target = newNodesList.find(n => n.id === edge.target);
        
        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = attraction * edge.strength * distance;
          
          source.vx += (dx / distance) * force;
          source.vy += (dy / distance) * force;
          target.vx -= (dx / distance) * force;
          target.vy -= (dy / distance) * force;
        }
      });

      // Apply forces and keep nodes in bounds
      newNodesList.forEach(node => {
        node.x += node.vx * alpha;
        node.y += node.vy * alpha;
        
        // Boundary constraints
        node.x = Math.max(50, Math.min(750, node.x));
        node.y = Math.max(50, Math.min(550, node.y));
      });

      return newNodesList;
    });
  }, [edges, setNodes]);

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with theme-appropriate background
    const canvasBg = theme === 'dark' ? '#1f2937' : '#f9fafb';
    ctx.fillStyle = canvasBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply scaling
    ctx.save();
    ctx.scale(scale, scale);

    // Draw edges with theme-appropriate colors
    ctx.strokeStyle = theme === 'dark' ? '#4b5563' : '#d1d5db';
    ctx.lineWidth = 1;
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.stroke();
      }
    });

    // Draw nodes with centralized colors
    nodes.forEach(node => {
      const radius = 8;
      let color = '#6366f1'; // Default indigo
      
      switch (node.difficulty) {
        case 'Easy':
          color = '#10b981'; // Green - matches colors.chart.easy
          break;
        case 'Medium':
          color = '#f59e0b'; // Amber - matches colors.chart.medium
          break;
        case 'Hard':
          color = '#ef4444'; // Red - matches colors.chart.hard
          break;
      }

      // Draw node circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Draw node border with theme-appropriate color
      ctx.strokeStyle = theme === 'dark' ? '#374151' : '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label with theme-appropriate color
      ctx.fillStyle = theme === 'dark' ? '#e5e7eb' : '#374151';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      const shortLabel = node.label.length > 20 ? node.label.substring(0, 20) + '...' : node.label;
      ctx.fillText(shortLabel, node.x, node.y + radius + 15);
    });

    ctx.restore();
  }, [nodes, edges, scale, theme, canvasRef]);

  const loadProblems = async () => {
    try {
      const { data, error } = await problemsService.getAllProblems();
      if (error) throw error;
      if (data) setProblems(data);
    } catch (error) {
      console.error('Error loading problems:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
  }, []);

  // Removed eslint-disable-next-line for generateGraph
  useEffect(() => {
    if (problems.length > 0) {
      generateGraph();
    }
  }, [problems, selectedDifficulty, selectedTag, generateGraph]); // Added generateGraph

  // Removed eslint-disable-next-line for simulateForces and drawGraph
  useEffect(() => {
    if (nodes.length > 0) {
      const canvas = canvasRef.current;
      if (canvas) {
        const interval = setInterval(() => {
          simulateForces();
          drawGraph();
        }, 50);
        return () => clearInterval(interval);
      }
    }
  }, [nodes, edges, scale, simulateForces, drawGraph]); // Added simulateForces, drawGraph

  const handleZoomIn = useCallback(() => setScale(prev => Math.min(prev * 1.2, 3)), [setScale]);
  const handleZoomOut = useCallback(() => setScale(prev => Math.max(prev / 1.2, 0.3)), [setScale]);
  const handleReset = useCallback(() => {
    setScale(1);
    generateGraph();
  }, [setScale, generateGraph]);

  if (loading) {
    return <div className={`text-center py-8 ${colors.text.primary}`}>Loading graph...</div>;
  }

  return (
    <div className={`space-y-6 ${colors.background.primary} min-h-screen p-6`}>
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${colors.text.primary}`}>Problem Graph</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className={`p-2 ${colors.text.secondary} ${colors.text.linkHover} transition-colors`}
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomIn}
            className={`p-2 ${colors.text.secondary} ${colors.text.linkHover} transition-colors`}
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleReset}
            className={`p-2 ${colors.text.secondary} ${colors.text.linkHover} transition-colors`}
            title="Reset"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={`${colors.background.card} p-4 rounded-lg shadow border ${colors.border.primary}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className={`w-4 h-4 ${colors.text.secondary}`} />
            <span className={`text-sm font-medium ${colors.text.primary}`}>Filters:</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className={`px-3 py-2 border rounded-md text-sm ${colors.input.base} ${colors.input.focus} transition-colors`}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <input
              type="text"
              placeholder="Filter by tag..."
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className={`px-3 py-2 border rounded-md text-sm ${colors.input.base} ${colors.input.focus} transition-colors`}
            />
          </div>
        </div>
      </div>

      {/* Graph Canvas */}
      <div className={`${colors.background.card} rounded-lg shadow p-6 border ${colors.border.primary}`}>
        <div className="mb-6">
          <h2 className={`text-lg font-medium ${colors.text.primary} mb-2`}>
            Problem Connections ({nodes.length} problems, {edges.length} connections)
          </h2>
          <p className={`text-sm ${colors.text.secondary} mb-4`}>
            Problems are connected when they share tags. Node colors represent difficulty:
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span className={colors.text.secondary}>Easy</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
              <span className={colors.text.secondary}>Medium</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              <span className={colors.text.secondary}>Hard</span>
            </div>
          </div>
        </div>
        
        <div className={`border rounded-lg overflow-hidden ${colors.border.primary}`}>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        
        {nodes.length === 0 && (
          <div className={`text-center py-8 ${colors.text.muted}`}>
            No problems to display. {problems.length === 0 ? 'Add some problems first!' : 'Try adjusting your filters.'}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className={`${colors.background.card} rounded-lg shadow p-6 border ${colors.border.primary}`}>
        <h3 className={`text-lg font-medium ${colors.text.primary} mb-4`}>How to Read the Graph</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className={`font-medium ${colors.text.headings} mb-3`}>Nodes (Problems)</h4>
            <ul className={`space-y-2 ${colors.text.secondary}`}>
              <li>• Each circle represents a LeetCode problem</li>
              <li>• Color indicates difficulty level</li>
              <li>• Size is consistent for all problems</li>
            </ul>
          </div>
          <div>
            <h4 className={`font-medium ${colors.text.headings} mb-3`}>Connections (Edges)</h4>
            <ul className={`space-y-2 ${colors.text.secondary}`}>
              <li>• Lines connect problems with shared tags</li>
              <li>• More shared tags = stronger connection</li>
              <li>• Helps identify problem patterns and topics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graph;