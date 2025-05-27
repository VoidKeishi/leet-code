import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { problemsService } from '../../services/database';
import { Problem, Implementation } from '../../types';
import { Save, Plus, Trash2, ArrowLeft } from 'lucide-react';

const ProblemEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [problem, setProblem] = useState<Partial<Problem>>({
    number: 0,
    title: '',
    difficulty: 'Easy',
    link: '',
    tags: [],
    intuition: '',
    implementations: [],
  });

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      loadProblem();
    }
  }, [id]);

  const loadProblem = async () => {
    if (!id) return;
    try {
      const { data, error } = await problemsService.getProblemById(id);
      if (error) throw error;
      if (data) setProblem(data);
    } catch (error) {
      console.error('Error loading problem:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isEditing && id) {
        await problemsService.updateProblem(id, problem as Problem);
      } else {
        await problemsService.createProblem(problem as Omit<Problem, 'id' | 'created_at' | 'updated_at'>);
      }
      navigate('/problems');
    } catch (error) {
      console.error('Error saving problem:', error);
    } finally {
      setLoading(false);
    }
  };

  const addImplementation = () => {
    setProblem({
      ...problem,
      implementations: [
        ...(problem.implementations || []),
        { language: 'JavaScript', code: '', time_complexity: '', space_complexity: '' }
      ]
    });
  };

  const updateImplementation = (index: number, field: keyof Implementation, value: string) => {
    const implementations = [...(problem.implementations || [])];
    implementations[index] = { ...implementations[index], [field]: value };
    setProblem({ ...problem, implementations });
  };

  const removeImplementation = (index: number) => {
    const implementations = [...(problem.implementations || [])];
    implementations.splice(index, 1);
    setProblem({ ...problem, implementations });
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setProblem({ ...problem, tags });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/problems')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Problem' : 'Add New Problem'}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem Number
            </label>
            <input
              type="number"
              value={problem.number || ''}
              onChange={(e) => setProblem({ ...problem, number: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={problem.difficulty || 'Easy'}
              onChange={(e) => setProblem({ ...problem, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={problem.title || ''}
            onChange={(e) => setProblem({ ...problem, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Two Sum"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LeetCode Link
          </label>
          <input
            type="url"
            value={problem.link || ''}
            onChange={(e) => setProblem({ ...problem, link: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://leetcode.com/problems/two-sum/"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={problem.tags?.join(', ') || ''}
            onChange={(e) => handleTagsChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Array, Hash Table, Two Pointers"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intuition (Markdown)
          </label>
          <textarea
            value={problem.intuition || ''}
            onChange={(e) => setProblem({ ...problem, intuition: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Explain your approach and thought process..."
          />
        </div>

        {/* Implementations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Implementations</h3>
            <button
              onClick={addImplementation}
              className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Implementation
            </button>
          </div>

          {problem.implementations?.map((impl, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <select
                  value={impl.language}
                  onChange={(e) => updateImplementation(index, 'language', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="JavaScript">JavaScript</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="C++">C++</option>
                  <option value="C">C</option>
                  <option value="Go">Go</option>
                  <option value="Rust">Rust</option>
                </select>
                <button
                  onClick={() => removeImplementation(index)}
                  className="p-2 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code
                  </label>
                  <textarea
                    value={impl.code}
                    onChange={(e) => updateImplementation(index, 'code', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                    placeholder="Enter your code here..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Complexity
                    </label>
                    <input
                      type="text"
                      value={impl.time_complexity || ''}
                      onChange={(e) => updateImplementation(index, 'time_complexity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="O(n)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Space Complexity
                    </label>
                    <input
                      type="text"
                      value={impl.space_complexity || ''}
                      onChange={(e) => updateImplementation(index, 'space_complexity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="O(1)"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!problem.implementations || problem.implementations.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No implementations yet. Click "Add Implementation" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemEditor;