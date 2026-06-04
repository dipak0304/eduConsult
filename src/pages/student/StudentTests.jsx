import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Button from '../../components/ui/Button';

const StudentTests = ({ student }) => {
  const { tests, testResults, addTestResult } = useData();
  const [quizState, setQuizState] = useState(null);
  const [quizTimer, setQuizTimer] = useState(null);

  const startTest = (testId) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return;
    setQuizState({
      testId,
      currentQ: 0,
      answers: {},
      startTime: Date.now(),
      timeLeft: test.timeLimit * 60,
      submitted: false,
    });
    
    const timer = setInterval(() => {
      setQuizState(prev => {
        if (!prev || prev.timeLeft <= 0) {
          clearInterval(timer);
          submitQuiz();
          return prev;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    setQuizTimer(timer);
  };

  const submitQuiz = () => {
    if (!quizState || quizState.submitted) return;
    clearInterval(quizTimer);
    
    const test = tests.find(t => t.id === quizState.testId);
    if (!test) return;
    
    let score = 0;
    test.questions.forEach((q, i) => {
      if (quizState.answers[i] === q.correctAnswer) score++;
    });
    
    addTestResult({
      testId: quizState.testId,
      studentId: student.id,
      answers: { ...quizState.answers },
      score,
      totalQuestions: test.questions.length,
    });
    
    setQuizState({ ...quizState, submitted: true });
  };

  const selectAnswer = (idx) => {
    setQuizState({
      ...quizState,
      answers: { ...quizState.answers, [quizState.currentQ]: idx },
    });
  };

  const quizNav = (dir) => {
    const test = tests.find(t => t.id === quizState.testId);
    if (!test) return;
    const newQ = quizState.currentQ + dir;
    if (newQ >= 0 && newQ < test.questions.length) {
      setQuizState({ ...quizState, currentQ: newQ });
    }
  };

  const quizGoTo = (idx) => {
    setQuizState({ ...quizState, currentQ: idx });
  };

  const exitQuiz = () => {
    if (quizTimer) clearInterval(quizTimer);
    setQuizState(null);
  };

  if (quizState && !quizState.submitted) {
    const test = tests.find(t => t.id === quizState.testId);
    if (!test) return null;
    const q = test.questions[quizState.currentQ];
    const total = test.questions.length;
    const pct = Math.round((quizState.currentQ + 1) / total * 100);
    const mins = Math.floor(quizState.timeLeft / 60);
    const secs = quizState.timeLeft % 60;
    const timerColor = quizState.timeLeft < 60 ? 'text-red-500' : quizState.timeLeft < 300 ? 'text-amber-500' : 'text-blue-500';

    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-navy-950">
        <div className="h-full flex flex-col">
          <div className="px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-navy-900">
            <div className="flex items-center justify-between mb-2">
              <button onClick={exitQuiz} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm">
                <i className="fa-solid fa-xmark mr-1" /> Exit
              </button>
              <h3 className="text-sm font-bold text-navy-900 dark:text-white truncate mx-4">{test.title}</h3>
              <div className={`flex items-center gap-1 ${timerColor} font-mono text-sm font-bold`}>
                <i className="fa-regular fa-clock text-xs" />
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-100 dark:bg-navy-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{quizState.currentQ + 1}/{total}</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-blue-500 font-semibold mb-2">Question {quizState.currentQ + 1}</p>
              <h2 className="text-lg sm:text-xl font-bold text-navy-900 dark:text-white mb-6">{q.question}</h2>
              <div className="space-y-3">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => selectAnswer(i)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      quizState.answers[quizState.currentQ] === i
                        ? 'border-blue-500 bg-blue-500/5'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      quizState.answers[quizState.currentQ] === i
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="px-4 sm:px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-navy-900">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
              <button
                onClick={() => quizNav(-1)}
                className={`px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-navy-900 dark:hover:text-white transition-colors ${
                  quizState.currentQ === 0 ? 'opacity-30 pointer-events-none' : ''
                }`}
              >
                <i className="fa-solid fa-chevron-left mr-1" /> Previous
              </button>
              <div className="flex gap-1 flex-wrap justify-center">
                {test.questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => quizGoTo(i)}
                    className={`w-7 h-7 rounded text-[10px] font-bold flex items-center justify-center transition-colors ${
                      i === quizState.currentQ
                        ? 'bg-blue-500 text-white'
                        : quizState.answers[i] !== undefined
                        ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-navy-800 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              {quizState.currentQ === total - 1 ? (
                <Button onClick={submitQuiz}>Submit</Button>
              ) : (
                <button
                  onClick={() => quizNav(1)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Next <i className="fa-solid fa-chevron-right ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizState && quizState.submitted) {
    const test = tests.find(t => t.id === quizState.testId);
    const result = testResults.find(r => r.testId === quizState.testId && r.studentId === student.id);
    const pct = result ? Math.round((result.score / result.totalQuestions) * 100) : 0;

    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-navy-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-trophy text-white text-3xl" />
          </div>
          <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">Test Completed!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Your score: {result?.score || 0}/{result?.totalQuestions || 0} ({pct}%)</p>
          <Button onClick={exitQuiz} className="w-full">
            Back to Tests
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">Mock Tests</h2>
      <div className="space-y-4">
        {tests.map((t) => {
          const result = testResults.find(r => r.testId === t.id && r.studentId === student.id);
          const pct = result ? Math.round((result.score / result.totalQuestions) * 100) : 0;
          const statusBadge = result ? (
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
              pct >= 60
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
            }`}>
              Score: {result.score}/{result.totalQuestions} ({pct}%)
            </span>
          ) : (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              Not Attempted
            </span>
          );
          const btn = result ? (
            <span className="px-4 py-2 bg-gray-100 dark:bg-navy-800 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-lg">
              Completed
            </span>
          ) : (
            <Button variant="secondary" onClick={() => startTest(t.id)}>
              <i className="fa-solid fa-play mr-1" /> Start Test
            </Button>
          );

          return (
            <div key={t.id} className="bg-white dark:bg-navy-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-navy-900 dark:text-white">{t.title}</h4>
                  {statusBadge}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    <i className="fa-regular fa-clock mr-1" />
                    {t.timeLimit} min
                  </span>
                  <span>
                    <i className="fa-solid fa-list-ol mr-1" />
                    {t.questions.length} questions
                  </span>
                </div>
              </div>
              {btn}
            </div>
          );
        })}
      </div>
      {tests.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <i className="fa-solid fa-file-lines text-4xl mb-3 opacity-30" />
          <p>No tests available</p>
        </div>
      )}
    </div>
  );
};

export default StudentTests;
