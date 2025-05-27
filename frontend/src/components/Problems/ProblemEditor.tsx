import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { problemsService } from '../../services/database';
import { Problem } from '../../types';
import { Check, Loader2, ArrowLeft, ExternalLink, Brain, Code, Clock, Zap } from 'lucide-react';

const difficultyOptions: Problem['difficulty'][] = ['Easy', 'Medium', 'Hard'];
const complexityOptions = [
  'O(1)',
  'O(log n)',
  'O(n)',
  'O(n log n)',
  'O(n^2)',
  'O(n^3)',
  'O(2^n)',
  'O(n!)',
  'Other', // For custom input
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
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [problem, setProblem] = useState<Partial<Problem>>({
    number: undefined,
    title: '',
    difficulty: 'Medium',
    tags: [],
    intuition: '',
    implementation: '',
    implementation_language: 'javascript', // Default language
    url: '',
    time_complexity: 'O(n)',
    space_complexity: 'O(1)',
  });
  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlFetching, setUrlFetching] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [detailsLocked, setDetailsLocked] = useState(false); // New state

  // Remove the isInfoLocked variable as we're simplifying

  useEffect(() => {
    if (isEditing && id) {
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
              implementation_language: data.implementation_language || 'javascript', // Load language
              url: data.url || '',
              time_complexity: data.time_complexity || 'O(n)',
              space_complexity: data.space_complexity || 'O(1)',
            });
            if (data && data.url && data.number && data.title) {
              setDetailsLocked(true); // Lock fields if essential details and URL exist
            }
          }
          setLoading(false);
        })
        .catch(err => {
          setError('An unexpected error occurred while loading.');
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, isEditing]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProblem(prev => ({ ...prev, [name]: value }));
    if (name === 'url') {
      setDetailsLocked(false); // Unlock fields if URL is changed
    }
  };

  const handleTagAdd = () => {
    if (detailsLocked) return; // Prevent adding tags if details are locked
    if (currentTag && !problem.tags?.includes(currentTag)) {
      setProblem(prev => ({ ...prev, tags: [...(prev.tags || []), currentTag] }));
      setCurrentTag('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    if (detailsLocked) return; // Prevent removing tags if details are locked
    setProblem(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.title || !problem.number) {
      setError('Problem number and title are required.');
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
      implementation_language: problem.implementation_language || 'javascript', // Save language
      url: problem.url || '',
      time_complexity: problem.time_complexity,
      space_complexity: problem.space_complexity,
    };

    try {
      if (isEditing && id) {
        console.log('Attempting to update problem with ID:', id);
        console.log('Data to save:', JSON.stringify(problemDataToSave, null, 2));
        const { data: updateData, error: updateError } = await problemsService.updateProblem(id, problemDataToSave);
        if (updateError) {
          console.error('Supabase update error:', updateError);
          throw updateError; // Propagate Supabase errors
        }
        // If no error, but also no data returned (or empty array), it means the record was not found for update or RLS prevented it.
        if (!updateData || updateData.length === 0) {
          console.warn('Update operation returned no data, indicating no rows were updated.');
          throw new Error("Update failed: The problem was not found (it may have been deleted or the ID is incorrect), or the update was not permitted (please check Row Level Security policies in Supabase).");
        }
        console.log('Update successful, returned data:', updateData);
      } else {
        console.log('Attempting to create new problem with data:', JSON.stringify(problemDataToSave, null, 2));
        const { data: createData, error: createError } = await problemsService.createProblem(problemDataToSave as Omit<Problem, 'id'>);
        if (createError) {
          console.error('Supabase create error:', createError);
          throw createError;
        }
        if (!createData) {
          console.warn('Create operation returned no data.');
          throw new Error("Failed to create problem: no data returned from the server. Check RLS policies for insert.");
        }
        console.log('Create successful, returned data:', createData);
      }
      navigate('/problems');
    } catch (err: any) {
      setError('Failed to save problem: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setSaving(false);
    }
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
      setDetailsLocked(true); // Lock fields after successful fetch
    } catch (err: any) {
      setUrlError(err.message || 'Failed to fetch problem details');
      setDetailsLocked(false); // Ensure fields are not locked on error
    } finally {
      setUrlFetching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="ml-4 text-lg">Loading problem...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <p className="text-xl">{error}</p>
        <button
          onClick={() => navigate('/problems')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" /> Go Back to Problems
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl bg-white dark:bg-gray-800 shadow-xl rounded-lg">
      <button
        onClick={() => navigate(isEditing ? `/problems/${id}` : '/problems')}
        className="mb-6 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition duration-150"
      >
        <ArrowLeft size={20} className="mr-2" />
        {isEditing ? 'Back to Problem View' : 'Back to Problems List'}
      </button>

      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 border-b pb-4">
        {isEditing ? 'Edit Problem Details' : 'Add New Problem'}
      </h1>

      {/* URL Input and Fetch Section - Moved to top */}
      {!isEditing && (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            LeetCode Problem URL (Optional - Auto-fill details)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              name="url"
              id="url"
              value={problem.url || ''}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-800 dark:text-gray-100"
              placeholder="https://leetcode.com/problems/two-sum/"
            />
            <button
              type="button"
              onClick={fetchProblemDetailsFromUrl}
              disabled={urlFetching || !problem.url}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {urlFetching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Fetch
                </>
              )}
            </button>
          </div>
          {urlFetching && <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">Fetching problem details...</p>}
          {urlError && <p className="text-sm text-red-600 dark:text-red-400 mt-2">{urlError}</p>}
        </div>
      )}

      {/* Fetched Problem Info Display */}
      {detailsLocked && (
        <div className="mb-8 p-6 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 pb-3 border-b border-gray-300 dark:border-gray-600">
            Fetched Problem Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Number Card */}
            <div className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Number</span>
              <div className="mt-1 text-lg font-semibold text-gray-800 dark:text-gray-100">#{problem.number}</div>
            </div>
            {/* Difficulty Card */}
            <div className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Difficulty</span>
              <div className="mt-1">
                <span className={`px-2 py-1 rounded text-sm font-medium $ {
                  problem.difficulty === 'Easy'
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                    : problem.difficulty === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                }`}> 
                  {problem.difficulty}
                </span>
              </div>
            </div>
            {/* Title Card */}
            <div className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm md:col-span-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Title</span>
              <div className="mt-1 text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">{problem.title}</div>
            </div>
            {/* Tags Card */}
            <div className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm md:col-span-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tags</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {problem.tags?.map(tag => (
                  <span key={tag} className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
     
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Conditional rendering for manual input fields (Number, Title, Difficulty, Tags) */}
        { !detailsLocked && (isEditing || (!isEditing && urlError !== null)) && (
          <>
            <div>
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Problem Number
              </label>
              <input
                type="number"
                name="number"
                id="number"
                value={problem.number || ''}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
                placeholder="e.g., 1"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={problem.title || ''}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
                placeholder="e.g., Two Sum"
              />
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty
              </label>
              <select
                name="difficulty"
                id="difficulty"
                value={problem.difficulty || 'Medium'}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:text-gray-100"
              >
                {difficultyOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={e => setCurrentTag(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleTagAdd();}}}
                  placeholder="Add a tag and press Enter"
                  className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 min-h-[20px]">
                {problem.tags?.map(tag => (
                  <span
                    key={tag}
                    className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="ml-2 text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-100 focus:outline-none"
                      aria-label={`Remove ${tag}`}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Intuition - unchanged */}
        <div>
          <label htmlFor="intuition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            <Brain size={18} className="inline mr-2 text-purple-600" />Intuition
          </label>
          <textarea
            name="intuition"
            id="intuition"
            value={problem.intuition || ''}
            onChange={handleInputChange}
            rows={6}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
            placeholder="Explain your approach and reasoning..."
          />
        </div>

        {/* Implementation with integrated language selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="implementation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <Code size={18} className="inline mr-2 text-green-600" />Implementation
            </label>
            <select
              name="implementation_language"
              id="implementation_language"
              value={problem.implementation_language}
              onChange={handleInputChange}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm dark:text-gray-100"
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
            rows={15}
            className="block w-full px-3 py-2 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Paste your code solution here..."
          />
        </div>

        {/* Time and Space Complexity side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="time_complexity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Clock size={18} className="inline mr-2 text-red-600" />Time Complexity
            </label>
            <select
              name="time_complexity"
              id="time_complexity"
              value={problem.time_complexity}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm dark:text-gray-100"
            >
              {complexityOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="space_complexity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <Zap size={18} className="inline mr-2 text-yellow-600" />Space Complexity
            </label>
            <select
              name="space_complexity"
              id="space_complexity"
              value={problem.space_complexity}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm dark:text-gray-100"
            >
              {complexityOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={saving}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 flex items-center justify-center"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <Check className="mr-2 h-5 w-5" />
            )}
            {isEditing ? 'Update Problem' : 'Create Problem'}
          </button>
        </div>
      </form>

      {/* Error message at the bottom, if any */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </div>
  );
};

export default ProblemEditor;