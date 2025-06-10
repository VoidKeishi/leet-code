import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Problem } from '../../types';
import { problemsService } from '../../services/database';
import { Save, XCircle, AlertTriangle, Trash2, Eye, Loader2, ExternalLink, Code, Clock, Zap, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { colors } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';

const complexityOptions = [
  'O(1)',
  'O(log n)',
  'O(n)',
  'O(n log n)',
  'O(n^2)',
  'O(n^3)',
  'O(2^n)',
  'O(n!)',
  'Other',
];

const supportedLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'rust', label: 'Rust' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'php', label: 'PHP' },
  { value: 'scala', label: 'Scala' },
  { value: 'sql', label: 'SQL' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'plaintext', label: 'Plain Text' },
];

const ProblemEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [problem, setProblem] = useState<Partial<Problem>>({
    number: undefined,
    title: '',
    difficulty: 'Medium',
    tags: [],
    intuition: '',
    implementation: '',
    implementation_language: 'javascript',
    url: '',
    time_complexity: 'O(n)',
    space_complexity: 'O(1)',
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlFetching, setUrlFetching] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [problemFetched, setProblemFetched] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      problemsService.getProblemById(id)
        .then(({ data, error }) => {
          if (error) {
            setError('Failed to load problem: ' + error.message);
            console.error(error);
          } else if (data) {
            setProblem({
              ...data,
              tags: data.tags || [],
              intuition: data.intuition || '',
              implementation: data.implementation || '',
              implementation_language: data.implementation_language || 'javascript',
              url: data.url || '',
              time_complexity: data.time_complexity || 'O(n)',
              space_complexity: data.space_complexity || 'O(1)',
            });
            setProblemFetched(true);
          }
          setLoading(false);
        })
        .catch(err => {
          setError('An unexpected error occurred while loading.');
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProblem(prev => ({ ...prev, [name]: value }));
  };

  const fetchProblemDetailsFromUrl = async () => {
    if (!problem.url) {
      setUrlError("Please enter a URL.");
      return;
    }
    setUrlFetching(true);
    setUrlError(null);
    try {
      const match = problem.url?.match(/leetcode\.com\/problems\/([^/]+)/);
      if (!match) throw new Error('Invalid LeetCode URL');
      const slug = match[1];
      const proxyUrl = 'https://thingproxy.freeboard.io/fetch/https://leetcode.com/graphql';
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `query getQuestion($titleSlug: String!) { question(titleSlug: $titleSlug) { questionId title difficulty topicTags { name } } }`,
          variables: { titleSlug: slug }
        })
      });
      const result = await response.json();
      const q = result.data?.question;
      if (!q) throw new Error('Problem not found');
      
      setProblem(prev => ({
        ...prev,
        number: Number(q.questionId),
        title: q.title,
        difficulty: q.difficulty as Problem['difficulty'],
        tags: q.topicTags.map((t: any) => t.name),
      }));
      setProblemFetched(true);
    } catch (err: any) {
      setUrlError(err.message || 'Failed to fetch problem details');
      setProblemFetched(false);
    } finally {
      setUrlFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.title || !problem.number) {
      setError('Problem details must be fetched from URL first.');
      return;
    }
    setSaving(true);
    setError(null);

    const problemDataToSave: Omit<Problem, 'id' | 'created_at' | 'updated_at'> & { id?: string } = {
      number: Number(problem.number),
      title: problem.title!,
      difficulty: problem.difficulty!,
      tags: problem.tags || [],
      intuition: problem.intuition || '',
      implementation: problem.implementation || '',
      implementation_language: problem.implementation_language || 'javascript',
      url: problem.url || '',
      time_complexity: problem.time_complexity,
      space_complexity: problem.space_complexity,
    };

    try {
      if (id) {
        const { data: updateData, error: updateError } = await problemsService.updateProblem(id, problemDataToSave);
        if (updateError) {
          throw updateError;
        }
        if (!updateData || updateData.length === 0) {
          throw new Error("Update failed: The problem was not found or the update was not permitted.");
        }
      } else {
        const { data: createData, error: createError } = await problemsService.createProblem(problemDataToSave as Omit<Problem, 'id'>);
        if (createError) {
          throw createError;
        }
        if (!createData) {
          throw new Error("Failed to create problem: no data returned from the server.");
        }
      }
      navigate('/problems');
    } catch (err: any) {
      setError('Failed to save problem: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this problem?')) return;
    
    setSaving(true);
    try {
      await problemsService.deleteProblem(id);
      navigate('/problems');
    } catch (err: any) {
      setError('Failed to delete problem: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading && id) {
    return <div className={`text-center py-8 ${colors.text.secondary}`}>Loading problem to edit...</div>;
  }

  const highlighterTheme = theme === 'dark' ? vscDarkPlus : vs;

  return (
    <div className={`container mx-auto px-4 py-8 ${colors.background.primary}`}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className={`text-3xl font-bold ${colors.text.primary}`}>
            {id ? `Edit Problem` : 'Add New Problem'}
          </h1>
          <div className="flex space-x-3 mt-4 md:mt-0">
            {id && (
              <button 
                type="button"
                onClick={() => navigate(`/problems/${id}`)}
                className={`inline-flex items-center px-4 py-2 border ${colors.border.primary} rounded-md shadow-sm text-sm font-medium ${colors.text.secondary} ${colors.background.card} ${colors.background.hover}`}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Problem
              </button>
            )}
            <button 
              type="button"
              onClick={() => navigate(id ? `/problems/${id}` : '/problems')}
              className={`inline-flex items-center px-4 py-2 border ${colors.border.primary} rounded-md shadow-sm text-sm font-medium ${colors.text.secondary} ${colors.background.card} ${colors.background.hover}`}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving || (!problemFetched && !id)}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${colors.text.inverse} ${colors.button.primary} ${(saving || (!problemFetched && !id)) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : id ? 'Save Changes' : 'Create Problem'}
            </button>
            {id && (
              <button 
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${colors.text.inverse} ${colors.button.danger} ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {saving ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`p-4 mb-6 rounded-md ${colors.status.error} flex items-center`}>
            <AlertTriangle className="h-5 w-5 mr-3" />
            <span>{error}</span>
          </div>
        )}

        {/* URL Input Section */}
        {!id && (
          <div className={`p-6 rounded-lg shadow ${colors.background.card} border ${colors.border.primary}`}>
            <h2 className={`text-lg font-semibold ${colors.text.primary} mb-4`}>
              <ExternalLink className="inline mr-2 h-5 w-5" />
              LeetCode Problem URL
            </h2>
            <div className="flex gap-2">
              <input
                type="url"
                name="url"
                value={problem.url || ''}
                onChange={handleInputChange}
                className={`flex-1 border rounded-md shadow-sm p-3 ${colors.input.base} ${colors.input.focus}`}
                placeholder="https://leetcode.com/problems/two-sum/"
                required
              />
              <button
                type="button"
                onClick={fetchProblemDetailsFromUrl}
                disabled={urlFetching || !problem.url}
                className={`px-6 py-3 rounded-md flex items-center justify-center ${colors.button.primary} ${(urlFetching || !problem.url) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {urlFetching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Fetch Details
                  </>
                )}
              </button>
            </div>
            {urlFetching && <p className={`text-sm ${colors.primary.text} mt-2`}>Fetching problem details...</p>}
            {urlError && <p className={`text-sm ${colors.text.error} mt-2`}>{urlError}</p>}
          </div>
        )}

        {/* Problem Info Display (only after fetch or when editing) */}
        {(problemFetched || id) && (
          <div className={`p-6 rounded-lg shadow ${colors.background.card} border ${colors.border.primary}`}>
            <h2 className={`text-lg font-semibold ${colors.text.primary} mb-4`}>
              Problem Overview
            </h2>
            
            {/* Problem Number and Title Row */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className={`text-lg font-medium ${colors.text.secondary}`}>{problem.number}.</span>
              <h3 className={`text-lg font-medium ${colors.text.primary}`}>{problem.title}</h3>
              <span className={`ml-auto px-3 py-1 text-xs font-medium rounded-full ${
                problem.difficulty === 'Easy' ? colors.difficulty.easy.bg + ' ' + colors.difficulty.easy.text :
                problem.difficulty === 'Medium' ? colors.difficulty.medium.bg + ' ' + colors.difficulty.medium.text :
                colors.difficulty.hard.bg + ' ' + colors.difficulty.hard.text
              }`}>
                {problem.difficulty}
              </span>
            </div>

            {/* Tags Row */}
            {problem.tags && problem.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {problem.tags.map(tag => (
                  <span
                    key={tag}
                    className={`px-3 py-1 text-sm rounded-md ${colors.tag.default.bg} ${colors.tag.default.text}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* URL link if exists */}
            {problem.url && (
              <div className="mt-3">
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${colors.text.link} ${colors.text.linkHover} text-sm underline transition-colors`}
                >
                  View on LeetCode
                </a>
              </div>
            )}
          </div>
        )}

        {/* Only show the rest of the form if problem details are available */}
        {(problemFetched || id) && (
          <>
            {/* Intuition and Implementation Section - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Intuition Section */}
              <div className={`p-6 rounded-lg shadow ${colors.background.card} border ${colors.border.primary}`}>
                <label htmlFor="intuition" className={`block text-lg font-semibold ${colors.text.primary} mb-4`}>
                  <Lightbulb size={20} className="inline mr-2" />
                  Intuition
                </label>
                <textarea
                  id="intuition"
                  name="intuition"
                  value={problem.intuition || ''}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-md shadow-sm ${colors.input.base} ${colors.input.focus} resize-y`}
                  style={{ height: '360px' }}
                  placeholder="Explain your approach and thought process..."
                />
                <p className={`mt-2 text-xs ${colors.text.muted}`}>Describe your approach, key insights, and reasoning.</p>
              </div>

              {/* Implementation Section */}
              <div className={`p-6 rounded-lg shadow ${colors.background.card} border ${colors.border.primary}`}>
                <div className="flex items-center justify-between mb-4">
                  <label htmlFor="implementation" className={`block text-lg font-semibold ${colors.text.primary}`}>
                    <Code size={20} className="inline mr-2" />
                    Implementation
                  </label>
                  <select
                    name="implementation_language"
                    value={problem.implementation_language}
                    onChange={handleInputChange}
                    className={`px-3 py-2 border rounded-md shadow-sm text-sm ${colors.input.base} ${colors.input.focus}`}
                  >
                    {supportedLanguages.map(lang => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  name="implementation"
                  id="implementation"
                  value={problem.implementation || ''}
                  onChange={handleInputChange}
                  className={`w-full p-3 font-mono text-sm border rounded-md shadow-sm ${colors.input.base} ${colors.input.focus} resize-y`}
                  style={{ height: '360px' }}
                  placeholder="Paste your code solution here..."
                />
                
                {/* Code Preview */}
                {problem.implementation && (
                  <div className="mt-4">
                    <h4 className={`text-sm font-medium ${colors.text.primary} mb-2`}>Preview:</h4>
                    <div className={`rounded-lg overflow-hidden border ${colors.border.primary}`}>
                      <SyntaxHighlighter
                        language={problem.implementation_language || 'javascript'}
                        style={highlighterTheme}
                        showLineNumbers
                        customStyle={{
                          margin: 0,
                          borderRadius: '0.5rem',
                        }}
                      >
                        {problem.implementation}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Complexity Analysis Section - Full Width */}
            <div className={`p-6 rounded-lg shadow ${colors.background.card} border ${colors.border.primary}`}>
              <h3 className={`text-lg font-semibold ${colors.text.primary} mb-4`}>Complexity Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="time_complexity" className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                    <Clock size={16} className="inline mr-2 text-red-500" />
                    Time Complexity
                  </label>
                  <select
                    name="time_complexity"
                    id="time_complexity"
                    value={problem.time_complexity}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm ${colors.input.base} ${colors.input.focus}`}
                  >
                    {complexityOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="space_complexity" className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                    <Zap size={16} className="inline mr-2 text-yellow-500" />
                    Space Complexity
                  </label>
                  <select
                    name="space_complexity"
                    id="space_complexity"
                    value={problem.space_complexity}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm ${colors.input.base} ${colors.input.focus}`}
                  >
                    {complexityOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default ProblemEditor;