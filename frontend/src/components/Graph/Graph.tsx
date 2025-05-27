import React, { useState, useEffect, useRef } from 'react';
import { problemsService } from '../../services/database';
import { Problem } from '../../types';
import { RefreshCw, ZoomIn, ZoomOut, Filter } from 'lucide-react';

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

  useEffect(() => {
    loadProblems();
  }, []);

  useEffect(() => {
    if (problems.length > 0) {
      generateGraph();
    }
  }, [problems, selectedDifficulty, selectedTag]);

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
  }, [nodes, edges, scale]);

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

  const generateGraph = () => {
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
  };

  const simulateForces = () => {
    const alpha = 0.1;
    const repulsion = 100;
    const attraction = 0.01;

    setNodes(prevNodes => {
      const newNodes = [...prevNodes];

      // Reset forces
      newNodes.forEach(node => {
        node.vx *= 0.9; // Damping
        node.vy *= 0.9;
      });

      // Repulsion between all nodes
      for (let i = 0; i < newNodes.length; i++) {
        for (let j = i + 1; j < newNodes.length; j++) {
          const dx = newNodes[j].x - newNodes[i].x;
          const dy = newNodes[j].y - newNodes[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsion / (distance * distance);
          
          newNodes[i].vx -= (dx / distance) * force;
          newNodes[i].vy -= (dy / distance) * force;
          newNodes[j].vx += (dx / distance) * force;
          newNodes[j].vy += (dy / distance) * force;
        }
      }

      // Attraction along edges
      edges.forEach(edge => {
        const source = newNodes.find(n => n.id === edge.source);
        const target = newNodes.find(n => n.id === edge.target);
        
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
      newNodes.forEach(node => {
        node.x += node.vx * alpha;
        node.y += node.vy * alpha;
        
        // Boundary constraints
        node.x = Math.max(50, Math.min(750, node.x));
        node.y = Math.max(50, Math.min(550, node.y));
      });

      return newNodes;
    });
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply scaling
    ctx.save();
    ctx.scale(scale, scale);

    // Draw edges
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const radius = 8;
      let color = '#6366f1'; // Default indigo
      
      switch (node.difficulty) {
        case 'Easy':
          color = '#10b981'; // Green
          break;
        case 'Medium':
          color = '#f59e0b'; // Yellow
          break;
        case 'Hard':
          color = '#ef4444'; // Red
          break;
      }

      // Draw node circle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Draw node border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      const shortLabel = node.label.length > 20 ? node.label.substring(0, 20) + '...' : node.label;
      ctx.fillText(shortLabel, node.x, node.y + radius + 15);
    });

    ctx.restore();
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.3));
  const handleReset = () => {
    setScale(1);
    generateGraph();
  };

  const allTags = Array.from(new Set(problems.flatMap(p => p.tags)));

  if (loading) {
    return <div className="text-center py-8">Loading graph...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Problem Graph</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 text-gray-400 hover:text-gray-600"
            title="Reset"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Graph Canvas */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Problem Connections ({nodes.length} problems, {edges.length} connections)
          </h2>
          <p className="text-sm text-gray-600">
            Problems are connected when they share tags. Node colors represent difficulty:
            <span className="ml-2">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>Easy
              <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1 ml-3"></span>Medium
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1 ml-3"></span>Hard
            </span>
          </p>
        </div>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        
        {nodes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No problems to display. {problems.length === 0 ? 'Add some problems first!' : 'Try adjusting your filters.'}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">How to Read the Graph</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Nodes (Problems)</h4>
            <ul className="space-y-1">
              <li>• Each circle represents a LeetCode problem</li>
              <li>• Color indicates difficulty level</li>
              <li>• Size is consistent for all problems</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Connections (Edges)</h4>
            <ul className="space-y-1">
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