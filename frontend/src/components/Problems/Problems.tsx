import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { problemsService } from '../../services/database';
import { Problem } from '../../types';
import { Search, Filter, Plus, Edit, ExternalLink } from 'lucide-react';

const Problems: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('');

  useEffect(() => {
    loadProblems();
  }, []);

  useEffect(() => {
    filterProblems();
  }, [problems, searchQuery, difficultyFilter, tagFilter]);

  const loadProblems = async () => {
    try {
      const { data, error } = await problemsService.getAllProblems();
      if (error) throw error;
      if (data) {
        setProblems(data);
      }
    } catch (error) {
      console.error('Error loading problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProblems = () => {
    let filtered = problems;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.number.toString().includes(searchQuery) ||
        problem.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Difficulty filter
    if (difficultyFilter !== 'All') {
      filtered = filtered.filter(problem => problem.difficulty === difficultyFilter);
    }

    // Tag filter
    if (tagFilter) {
      filtered = filtered.filter(problem =>
        problem.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()))
      );
    }

    setFilteredProblems(filtered);
  };

  const allTags = Array.from(new Set(problems.flatMap(p => p.tags)));

  if (loading) {
    return <div className="text-center py-8">Loading problems...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Problems</h1>
        <Link
          to="/problems/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Problem
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems..."
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <input
            type="text"
            placeholder="Filter by tag..."
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Problems List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            {filteredProblems.length} Problems
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredProblems.map((problem) => (
            <div key={problem.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">
                      #{problem.number}
                    </span>
                    <Link
                      to={`/problems/${problem.id}`}
                      className="text-lg font-medium text-gray-900 hover:text-indigo-600"
                    >
                      {problem.title}
                    </Link>
                    <span className={`px-2 py-1 text-xs rounded ${
                      problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    {problem.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={problem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Open LeetCode"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <Link
                    to={`/problems/${problem.id}/edit`}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {filteredProblems.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              No problems found. {problems.length === 0 ? 'Add your first problem!' : 'Try adjusting your filters.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problems;