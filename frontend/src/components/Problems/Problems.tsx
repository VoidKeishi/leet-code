import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { problemsService } from '../../services/database';
import { Problem } from '../../types';
import { Search, Edit, ExternalLink } from 'lucide-react';
import { colors } from '../../theme/colors';

interface ProblemsProps {
  isGuest?: boolean;
}

const Problems: React.FC<ProblemsProps> = ({ isGuest = false }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [tagFilter, setTagFilter] = useState('');

  const filterProblems = useCallback(() => {
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
  }, [problems, searchQuery, difficultyFilter, tagFilter, setFilteredProblems]);

  useEffect(() => {
    loadProblems();
  }, []);

  // Disable missing dependency on filterProblems
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    filterProblems();
  }, [problems, searchQuery, difficultyFilter, tagFilter, filterProblems]);

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

  if (loading) {
    return <div className="text-center py-8">Loading problems...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${colors.text.primary} mb-4 md:mb-0`}>Problems</h1>
          {isGuest && (
            <p className={`text-sm ${colors.text.secondary}`}>
              Viewing in guest mode. Login to add or edit problems.
            </p>
          )}
        </div>
        {!isGuest && (
          <div className="flex space-x-3">
            <Link 
              to="/problems/new"
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${colors.text.inverse} ${colors.button.primary}`}
            >
              Add New Problem
            </Link>
          </div>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className={`mb-6 p-4 rounded-lg shadow ${colors.background.card} flex flex-col md:flex-row gap-4 items-center`}>
        <div className="relative flex-grow w-full md:w-auto">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${colors.text.muted}`} />
          <input 
            type="text"
            placeholder="Search problems by title, number, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-md shadow-sm ${colors.input.base} ${colors.input.focus}`}
          />
        </div>
        <select
          className={`px-3 py-2 border rounded-md shadow-sm ${colors.input.base} ${colors.input.focus}`}
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
          className={`px-3 py-2 border rounded-md shadow-sm ${colors.input.base} ${colors.input.focus}`}
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        />
      </div>

      {/* Problems Table/List */}
      {loading ? (
        <div className={`text-center py-8 ${colors.text.secondary}`}>Loading problems...</div>
      ) : filteredProblems.length === 0 ? (
        <div className={`text-center py-8 ${colors.text.secondary}`}>No problems found. Try adjusting your filters or adding a new problem.</div>
      ) : (
        <div className={`${colors.background.card} shadow overflow-hidden rounded-lg`}>
          <table className={`min-w-full divide-y ${colors.border.primary}`}>
            <thead className={colors.background.tertiary}>
              <tr>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${colors.text.secondary} uppercase tracking-wider`}>
                  Problem
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${colors.text.secondary} uppercase tracking-wider`}>
                  Difficulty
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${colors.text.secondary} uppercase tracking-wider`}>
                  Tags
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${colors.text.secondary} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${colors.border.primary}`}>
              {filteredProblems.map(problem => (
                <tr key={problem.id} className={`${colors.background.hover} transition-colors`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <Link to={`/problems/${problem.id}`} className={`${colors.primary.text} ${colors.primary.textHover} font-medium transition-colors`}>
                          {problem.number}. {problem.title}
                        </Link>
                        {problem.url && (
                          <div className="mt-1">
                            <a 
                              href={problem.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`${colors.text.link} ${colors.text.linkHover} text-sm inline-flex items-center transition-colors`}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              LeetCode
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      problem.difficulty === 'Easy' ? `${colors.difficulty.easy.bg} ${colors.difficulty.easy.text}` :
                      problem.difficulty === 'Medium' ? `${colors.difficulty.medium.bg} ${colors.difficulty.medium.text}` :
                      `${colors.difficulty.hard.bg} ${colors.difficulty.hard.text}`
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className={`px-2 py-1 text-xs rounded-md ${colors.tag.default.bg} ${colors.tag.default.text}`}>
                          {tag}
                        </span>
                      ))}
                      {problem.tags.length > 3 && (
                        <span className={`px-2 py-1 text-xs rounded-md ${colors.text.muted}`}>
                          +{problem.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link 
                        to={`/problems/${problem.id}`}
                        className={`${colors.text.link} ${colors.text.linkHover} transition-colors`}
                        title="View Problem"
                      >
                        View
                      </Link>
                      {!isGuest && (
                        <Link 
                          to={`/problems/${problem.id}/edit`}
                          className={`${colors.text.link} ${colors.text.linkHover} transition-colors`}
                          title="Edit Problem"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Problems;