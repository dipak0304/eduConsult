import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ResultChecking = () => {
  const [results, setResults] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gradingData, setGradingData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async (date = null) => {
    try {
      const token = localStorage.getItem('token');
      const url = date 
        ? `${API_BASE_URL}/result-checking/date/${date}`
        : `${API_BASE_URL}/result-checking`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    fetchResults(date);
  };

  const openGradingModal = (result) => {
    setSelectedResult(result);
    setGradingData({});
    setIsModalOpen(true);
  };

  const handleGradeChange = (questionIndex, field, value) => {
    setGradingData({
      ...gradingData,
      [questionIndex]: {
        ...gradingData[questionIndex],
        [field]: value,
      },
    });
  };

  const submitGrades = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      for (const [questionIndex, grade] of Object.entries(gradingData)) {
        if (grade.grade !== undefined && grade.grade !== '') {
          const response = await fetch(`${API_BASE_URL}/result-checking/grade`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              resultId: selectedResult._id,
              questionIndex: parseInt(questionIndex),
              grade: parseFloat(grade.grade),
              feedback: grade.feedback || '',
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            alert(`Error grading question: ${errorData.message || 'Unknown error'}`);
            setIsLoading(false);
            return;
          }
        }
      }
      
      setIsLoading(false);
      setIsModalOpen(false);
      setSelectedResult(null);
      setGradingData({});
      fetchResults(selectedDate);
    } catch (error) {
      console.error('Error submitting grades:', error);
      alert('Error submitting grades. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-navy-900 dark:text-white">Result Checking</h2>
        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="text-sm"
          />
          {selectedDate && (
            <Button variant="ghost" onClick={() => { setSelectedDate(''); fetchResults(); }}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <i className="fa-solid fa-clipboard-check text-4xl mb-3 opacity-30" />
          <p>No writing submissions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result._id} className="bg-white dark:bg-navy-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {result.studentId?.fullName?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 dark:text-white">{result.studentId?.fullName || 'Unknown Student'}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{result.studentId?.email || ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-navy-900 dark:text-white">{result.testId?.title || 'Unknown Test'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(result.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {result.testId?.questions?.map((q, i) => {
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
                              Grade: {grade.grade}
                            </span>
                            {grade.gradedBy === 'AI' && (
                              <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                                <i className="fa-solid fa-robot mr-1" /> AI Graded
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{q.question}</p>
                      <div className="p-3 bg-white dark:bg-navy-900 rounded border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{answer || 'No answer provided'}</p>
                      </div>
                      {grade?.feedback && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-500/10 rounded">
                          <p className="text-xs text-blue-700 dark:text-blue-400"><strong>Feedback:</strong> {grade.feedback}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
                {!result.testId?.questions?.some((q, i) => q.type === 'writing' && !result.writingGrades?.[i]) ? (
                  <span className="px-4 py-2 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-semibold rounded-lg">
                    All questions graded
                  </span>
                ) : (
                  <Button onClick={() => openGradingModal(result)}>
                    <i className="fa-solid fa-pen-to-square mr-1" /> Grade Answers
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedResult && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-navy-900 dark:text-white">
                Grade: {selectedResult.studentId?.fullName}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <i className="fa-solid fa-xmark text-xl" />
              </button>
            </div>

            <div className="space-y-6">
              {selectedResult.testId?.questions?.map((q, i) => {
                if (q.type !== 'writing') return null;
                
                const answer = selectedResult.writingAnswers?.[i] || '';
                const existingGrade = selectedResult.writingGrades?.[i];
                
                return (
                  <div key={i} className="space-y-3">
                    <h4 className="font-medium text-navy-900 dark:text-white">Question {i + 1}</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{q.question}</p>
                    <div className="p-3 bg-gray-50 dark:bg-navy-800/50 rounded">
                      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{answer}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Grade
                        </label>
                        <Input
                          type="number"
                          step="0.1"
                          value={gradingData[i]?.grade || existingGrade?.grade || ''}
                          onChange={(e) => handleGradeChange(i, 'grade', e.target.value)}
                          placeholder="Enter grade"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Feedback
                      </label>
                      <textarea
                        value={gradingData[i]?.feedback || existingGrade?.feedback || ''}
                        onChange={(e) => handleGradeChange(i, 'feedback', e.target.value)}
                        placeholder="Enter feedback"
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-navy-800 text-gray-900 dark:text-white text-sm focus:border-blue-500 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={submitGrades} disabled={isLoading} className="flex-1">
                {isLoading ? 'Saving...' : 'Submit Grades'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultChecking;
