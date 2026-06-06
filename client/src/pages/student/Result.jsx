import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';

const Result = ({ student }) => {
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

  useEffect(() => {
    fetchResults();
  }, [student]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/results/student/${student.id}`);
      if (response.ok) {
        const data = await response.json();
        const mappedResults = data.map(result => ({
          ...result,
          id: result._id,
          testId: result.testId,
          studentId: result.studentId,
        }));
        setResults(mappedResults);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const openResultModal = (result) => {
    setSelectedResult(result);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-navy-900 dark:text-white">My Results</h2>
        <Button onClick={fetchResults} variant="ghost">
          <i className="fa-solid fa-arrows-rotate mr-1" /> Refresh
        </Button>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <i className="fa-solid fa-clipboard-list text-4xl mb-3 opacity-30" />
          <p>No test results yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => {
            const test = result.testId;
            const hasWritingQuestions = test?.questions?.some(q => q.type === 'writing');
            const hasGrades = result.writingGrades && Object.keys(result.writingGrades).length > 0;
            
            return (
              <div key={result.id} className="bg-white dark:bg-navy-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-navy-900 dark:text-white">{test?.title || 'Unknown Test'}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Submitted: {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!hasWritingQuestions && (
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      result.score >= result.totalQuestions * 0.6
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                    }`}>
                      {result.score}/{result.totalQuestions}
                    </span>
                  )}
                  {hasWritingQuestions && hasGrades && (
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                      Graded
                    </span>
                  )}
                  {hasWritingQuestions && !hasGrades && (
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
                      Pending
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {test?.questions?.map((q, i) => {
                    if (q.type !== 'writing') return null;
                    
                    const answer = result.writingAnswers?.[i] || '';
                    const grade = result.writingGrades?.[i];
                    
                    return (
                      <div key={i} className="p-4 bg-gray-50 dark:bg-navy-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-navy-900 dark:text-white">Question {i + 1}</h4>
                          {grade && (
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                grade.grade <= 5
                                  ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                                  : grade.grade < 7
                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                              }`}>
                                {grade.grade}
                              </span>
                              {grade.gradedBy === 'AI' && (
                                <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                                  <i className="fa-solid fa-robot mr-1" /> AI
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">{q.question}</p>
                        {grade?.feedback && (
                          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded">
                            <p className="text-xs text-blue-700 dark:text-blue-400">
                              <strong>Feedback:</strong> {grade.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
                  <Button onClick={() => openResultModal(result)}>
                    View Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && selectedResult && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-navy-900 dark:text-white">
                {selectedResult.testId?.title || 'Test Details'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <i className="fa-solid fa-xmark text-xl" />
              </button>
            </div>

            <div className="space-y-6">
              {!selectedResult.testId?.questions?.some(q => q.type === 'writing') && (
                <div className="p-4 bg-gray-50 dark:bg-navy-800/50 rounded-lg">
                  <h4 className="font-medium text-navy-900 dark:text-white mb-2">MCQ Score</h4>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {selectedResult.score}/{selectedResult.totalQuestions}
                  </p>
                </div>
              )}

              {selectedResult.testId?.questions?.map((q, i) => {
                if (q.type !== 'writing') return null;
                
                const answer = selectedResult.writingAnswers?.[i] || '';
                const grade = selectedResult.writingGrades?.[i];
                
                return (
                  <div key={i} className="space-y-3">
                    <h4 className="font-medium text-navy-900 dark:text-white">Question {i + 1}</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{q.question}</p>
                    
                    <div className="p-3 bg-gray-50 dark:bg-navy-800/50 rounded">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your Answer:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{answer || 'No answer provided'}</p>
                    </div>
                    
                    {grade ? (
                      <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Grade: {grade.grade}</p>
                            {grade.gradedBy === 'AI' && (
                              <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                                <i className="fa-solid fa-robot mr-1" /> AI Graded
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Graded: {new Date(grade.gradedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {grade.feedback && (
                          <p className="text-sm text-blue-700 dark:text-blue-400">
                            <strong>Feedback:</strong> {grade.feedback}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-500/10 rounded">
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                          <strong>Pending Grading</strong>
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button onClick={() => setIsModalOpen(false)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
