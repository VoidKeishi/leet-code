import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { Problem } from '../../types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/solid';
import { colors, getDifficultyColor } from '../../theme/colors';
import { useTheme } from '../../context/ThemeContext';

const ProblemView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) {
        setError('Problem ID is missing.');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('problems')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) {
          throw fetchError;
        }
        if (data) {
          setProblem(data as Problem);
        } else {
          setError('Problem not found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch problem details.');
        console.error('Error fetching problem:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (loading) {
    return <div className={`text-center p-8 ${colors.text.primary}`}>Loading problem details...</div>;
  }

  if (error) {
    return <div className={`text-center p-8 ${colors.text.error}`}>{error}</div>;
  }

  if (!problem) {
    return <div className={`text-center p-8 ${colors.text.secondary}`}>No problem data available.</div>;
  }

  // Use more subtle themes that match the UI better
  const highlighterTheme = theme === 'dark' ? vscDarkPlus : vs;

  return (
    <div className={`p-4 md:p-6 lg:p-8 min-h-screen ${colors.background.primary}`}>
      <div className="mb-6 flex justify-between items-center">
        <Link
          to="/problems"
          className={`flex items-center ${colors.text.link} ${colors.text.linkHover} transition-colors`}
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Problems
        </Link>
        <Link
          to={`/problems/${problem.id}/edit`}
          className={`py-2 px-4 ${colors.button.secondary} ${colors.button.secondaryHover} font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 ${colors.primary.ring} focus:ring-opacity-75 transition-colors`}
        >
          <PencilIcon className="h-5 w-5 mr-2 inline" />
          Edit Problem
        </Link>
      </div>

      <div className={`${colors.background.card} shadow-lg rounded-lg overflow-hidden border ${colors.border.primary}`}>
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
            <h1 className={`text-3xl font-bold ${colors.text.headings} mb-2 md:mb-0`}>
              {problem.number}. {problem.title}
            </h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </div>

          {problem.url && (
            <div className="mb-4">
              <a
                href={problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${colors.text.link} ${colors.text.linkHover} underline transition-colors`}
              >
                View on LeetCode
              </a>
            </div>
          )}

          <div className="mb-6">
            <h2 className={`text-xl font-semibold ${colors.text.headings} mb-3`}>Tags</h2>
            <div className="flex flex-wrap gap-2">
              {problem.tags?.map((tag) => (
                <span key={tag} className={`px-3 py-1 text-sm rounded-md ${colors.tag.default.bg} ${colors.tag.default.text} transition-colors`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {problem.intuition && (
            <div className="mb-6">
              <h2 className={`text-xl font-semibold ${colors.text.headings} mb-3`}>Description/Intuition</h2>
              <div className={`prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none ${colors.text.primary} dark:prose-invert`}>
                <p className={`${colors.text.secondary} leading-relaxed`}>{problem.intuition}</p>
              </div>
            </div>
          )}
        </div>

        {problem.implementation && problem.implementation_language && (
          <div className="px-6 pb-6">
            <h2 className={`text-xl font-semibold ${colors.text.headings} mb-4`}>Implementation</h2>
            <div className={`rounded-lg overflow-hidden border ${colors.border.primary}`}>
              <SyntaxHighlighter
                language={problem.implementation_language.toLowerCase()}
                style={highlighterTheme}
                showLineNumbers
                customStyle={{
                  margin: 0,
                  borderRadius: '0.5rem',
                  backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f8f9fa',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                }}
                codeTagProps={{ 
                  style: { 
                    fontFamily: '"Fira Code", "JetBrains Mono", "Consolas", monospace',
                    fontSize: '14px'
                  } 
                }}
              >
                {problem.implementation}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        <div className={`border-t ${colors.border.primary} px-6 py-4 ${colors.background.secondary}`}>
          <div className={`flex flex-col sm:flex-row justify-between gap-2 ${colors.text.secondary} text-sm`}>
            <span>
              Time Complexity: <span className={`font-mono ${colors.text.primary}`}>{problem.time_complexity || 'N/A'}</span>
            </span>
            <span>
              Space Complexity: <span className={`font-mono ${colors.text.primary}`}>{problem.space_complexity || 'N/A'}</span>
            </span>
          </div>
          {problem.updated_at && (
            <p className={`mt-3 text-xs ${colors.text.muted}`}>
              Last updated: {new Date(problem.updated_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemView;