import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { problemsService } from '../../services/database';
import { Problem } from '../../types';
import { ArrowLeft, Edit, ExternalLink, Copy, Check, Clock, Zap } from 'lucide-react';

const ProblemView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImplementation, setSelectedImplementation] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (id) {
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
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (!problem?.implementations[selectedImplementation]?.code) return;
    
    try {
      await navigator.clipboard.writeText(problem.implementations[selectedImplementation].code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering - you might want to use a proper markdown library like react-markdown
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br>');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600">Loading problem...</div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center py-12">
        <div className="text-lg text-gray-600 mb-4">Problem not found</div>
        <Link to="/problems" className="text-indigo-600 hover:text-indigo-700">
          Back to Problems
        </Link>
      </div>
    );
  }

  const implementation = problem.implementations[selectedImplementation];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/problems')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-500">#{problem.number}</span>
              <h1 className="text-3xl font-bold text-gray-900">{problem.title}</h1>
              <span className={`px-3 py-1 text-sm rounded-full ${
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
        </div>
        <div className="flex items-center space-x-2">
          <a
            href={problem.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            LeetCode
          </a>
          <Link
            to={`/problems/${problem.id}/edit`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Intuition */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Intuition & Approach</h2>
            {problem.intuition ? (
              <div 
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(problem.intuition) }}
              />
            ) : (
              <p className="text-gray-500 italic">No intuition provided yet.</p>
            )}
          </div>

          {/* Problem Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Problem Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Difficulty:</span>
                <span className={`font-medium ${
                  problem.difficulty === 'Easy' ? 'text-green-600' :
                  problem.difficulty === 'Medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {problem.difficulty}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Problem Number:</span>
                <span className="font-medium">#{problem.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Implementations:</span>
                <span className="font-medium">{problem.implementations.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">
                  {new Date(problem.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Implementations */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Implementations</h2>
                {implementation && (
                  <button
                    onClick={copyCode}
                    className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
                  >
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {/* Language Tabs */}
              {problem.implementations.length > 0 && (
                <div className="flex space-x-1 mt-4">
                  {problem.implementations.map((impl, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImplementation(index)}
                      className={`px-3 py-2 text-sm rounded-md transition-colors ${
                        selectedImplementation === index
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {impl.language}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6">
              {problem.implementations.length > 0 ? (
                <>
                  {/* Complexity Info */}
                  {(implementation?.time_complexity || implementation?.space_complexity) && (
                    <div className="mb-6 grid grid-cols-2 gap-4">
                      {implementation.time_complexity && (
                        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="text-sm text-blue-600 font-medium">Time</div>
                            <div className="text-sm text-blue-800">{implementation.time_complexity}</div>
                          </div>
                        </div>
                      )}
                      {implementation.space_complexity && (
                        <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
                          <Zap className="w-4 h-4 text-purple-600" />
                          <div>
                            <div className="text-sm text-purple-600 font-medium">Space</div>
                            <div className="text-sm text-purple-800">{implementation.space_complexity}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Code Block */}
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{implementation?.code || 'No code provided'}</code>
                    </pre>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="mb-2">No implementations yet</div>
                  <Link
                    to={`/problems/${problem.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    Add an implementation
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Problem Metadata */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <span className="text-gray-600">Created:</span>
            <span className="ml-2 font-medium">
              {new Date(problem.created_at).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Last Modified:</span>
            <span className="ml-2 font-medium">
              {new Date(problem.updated_at).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Problem ID:</span>
            <span className="ml-2 font-mono text-xs">{problem.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemView;