import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'; // Added useParams
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { problemsService } from '../../services/database';
import { Problem } from '../../types';
import { ArrowLeft, Edit3, Trash2, Tag, ExternalLink, Brain, Code, Clock, Zap } from 'lucide-react';

const ProblemView: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Ensure id is typed if using TS
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Added error state

  const loadProblem = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await problemsService.getProblemById(id);
      if (fetchError) throw fetchError;
      if (data) {
        setProblem(data);
      } else {
        setError("Problem not found.");
      }
    } catch (err: any) {
      console.error('Error loading problem:', err);
      setError(err.message || "Failed to load problem.");
    } finally {
      setLoading(false);
    }
  }, [id, setLoading, setError, setProblem]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (id) {
      loadProblem();
    }
  }, [id, loadProblem]);

  const handleDelete = async () => {
    if (!id || !problem) return;
    if (window.confirm(`Are you sure you want to delete "${problem.title}"?`)) {
      try {
        const { error: deleteError } = await problemsService.deleteProblem(id);
        if (deleteError) throw deleteError;
        navigate('/problems');
      } catch (err: any) {
        console.error('Error deleting problem:', err);
        setError(err.message || "Failed to delete problem.");
        // Optionally, display a more user-friendly error message
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600">Loading problem...</div>
      </div>
    );
  }

  if (error) { // Display error message if error state is set
    return (
      <div className="text-center py-12">
        <div className="text-lg text-red-600 mb-4">{error}</div>
        <Link to="/problems" className="text-indigo-600 hover:text-indigo-700">
          Back to Problems
        </Link>
      </div>
    );
  }
  
  if (!problem) { // If no error but problem is still null (e.g. not found and no error thrown)
    return (
      <div className="text-center py-12">
        <div className="text-lg text-gray-600 mb-4">Problem not found</div>
        <Link to="/problems" className="text-indigo-600 hover:text-indigo-700">
          Back to Problems
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-6">
        <div>
          <button
            onClick={() => navigate('/problems')}
            className="mb-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Problems
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            {problem.number}. {problem.title}
            {problem.url && (
              <a 
                href={problem.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ml-3 text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                title="View on LeetCode"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </h1>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/problems/${problem.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ 
            problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200' :
            problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200' :
            'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200'
          }`}>
            {problem.difficulty}
          </span>
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
            <span>{problem.tags.join(', ') || 'No tags'}</span>
          </div>
        </div>
        {(problem.time_complexity || problem.space_complexity) && (
            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                {problem.time_complexity && (
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                        <span>Time: {problem.time_complexity}</span>
                    </div>
                )}
                {problem.space_complexity && (
                    <div className="flex items-center">
                        <Zap className="w-4 h-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                        <span>Space: {problem.space_complexity}</span>
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Intuition Section (Not side-by-side anymore) */}
      {problem.intuition && (
        <div className="mb-8 prose prose-sm dark:prose-invert max-w-none p-4 border dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-850">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />Intuition
          </h3>
          <ReactMarkdown children={problem.intuition} remarkPlugins={[remarkGfm]} components={markdownComponents()} />
        </div>
      )}

      {/* Implementation Section (Not side-by-side anymore) */}
      {problem.implementation && (
        <div className="prose prose-sm dark:prose-invert max-w-none p-4 border dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-850">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
            <Code className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />Implementation
          </h3>
          {/* Render implementation using SyntaxHighlighter directly for the main code block */}
          <SyntaxHighlighter
            children={String(problem.implementation).replace(/\n$/, '')}
            style={(atomDark as any)} 
            language={problem.implementation_language || 'plaintext'} 
            PreTag="div"
            showLineNumbers
            wrapLines
          />
          {/* If you still want to allow some Markdown within implementation (e.g., for notes around code), 
              you might need a more complex rendering strategy or instruct users to put notes in Intuition. 
              For now, this renders the whole implementation field as a single code block. 
          */}
        </div>
      )}
    </div>
  );
};

// Updated markdownComponents to be a function that can accept language for general use,
// but for ProblemView, we are using SyntaxHighlighter directly for the main implementation block.
const markdownComponents = (language?: string) => ({
  code({node, inline, className, children, ...props}: any) {
    // For Markdown *within* intuition or other general Markdown fields (not the main implementation block)
    const match = /language-(\w+)/.exec(className || '');
    const explicitLanguage = match ? match[1] : language; 

    if (!inline && explicitLanguage) {
      return (
        <SyntaxHighlighter
          children={String(children).replace(/\n$/, '')}
          style={(atomDark as any)} 
          language={explicitLanguage}
          PreTag="div"
          showLineNumbers
          wrapLines
          {...props}
        />
      );
    } else if (!inline) {
      // Fallback for code blocks within general Markdown without a specified language
      return (
        <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto">
          <code className="text-sm" {...props}>
            {children}
          </code>
        </pre>
      );
    }
    // Inline code
    return (
      <code className={`${className || ''} bg-gray-100 dark:bg-gray-700 text-red-500 dark:text-red-400 px-1 py-0.5 rounded text-sm`} {...props}>
        {children}
      </code>
    );
  }
});

export default ProblemView;