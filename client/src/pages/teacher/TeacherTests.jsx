import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const TeacherTests = () => {
  const [tests, setTests] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    timeLimit: 15,
    questions: [{ type: 'mcq', question: '', image: '', options: ['', '', '', ''], correctAnswer: 0, wordLimit: 300 }],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

  useEffect(() => {
    fetchTests();
    fetchTestResults();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tests`);
      if (response.ok) {
        const data = await response.json();
        const mappedTests = data.map(test => ({
          ...test,
          id: test._id,
        }));
        setTests(mappedTests);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const fetchTestResults = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/results/all`);
      if (response.ok) {
        const data = await response.json();
        const mappedResults = data.map(result => ({
          ...result,
          id: result._id,
          testId: result.testId?._id || result.testId,
          studentId: result.studentId?._id || result.studentId,
        }));
        setTestResults(mappedResults);
      }
    } catch (error) {
      console.error('Error fetching test results:', error);
    }
  };

  const addTest = async (testData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/tests`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(testData),
      });
      if (response.ok) {
        await fetchTests();
      } else {
        const error = await response.json();
        console.error('Error adding test:', error);
        alert(error.message || 'Failed to create test');
      }
    } catch (error) {
      console.error('Error adding test:', error);
    }
  };

  const updateTest = async (id, testData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/tests/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(testData),
      });
      if (response.ok) {
        await fetchTests();
      } else {
        const error = await response.json();
        console.error('Error updating test:', error);
        alert(error.message || 'Failed to update test');
      }
    } catch (error) {
      console.error('Error updating test:', error);
    }
  };

  const deleteTest = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/tests/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        await fetchTests();
        await fetchTestResults();
      } else {
        const error = await response.json();
        console.error('Error deleting test:', error);
        alert(error.message || 'Failed to delete test');
      }
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  const handleOpenModal = (test = null) => {
    if (test) {
      setEditingTest(test);
      setFormData({
        ...test,
        timeLimit: test.timeLimit || 15,
        questions: test.questions.map(q => ({
          ...q,
          image: q.image || '',
        })),
      });
    } else {
      setEditingTest(null);
      setFormData({
        title: '',
        timeLimit: 15,
        questions: [{ type: 'mcq', question: '', image: '', options: ['', '', '', ''], correctAnswer: 0, wordLimit: 300 }],
      });
    }
    setIsModalOpen(true);
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { type: 'mcq', question: '', image: '', options: ['', '', '', ''], correctAnswer: 0, wordLimit: 300 }],
    });
  };

  const removeQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index),
    });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    if (field === 'options') {
      updatedQuestions[index].options = value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Test title is required';
    }
    if (!formData.timeLimit || formData.timeLimit <= 0) {
      newErrors.timeLimit = 'Time limit is required';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    if (editingTest) {
      updateTest(editingTest.id, formData);
    } else {
      addTest(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setTestToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (testToDelete) {
      await deleteTest(testToDelete);
      setDeleteModalOpen(false);
      setTestToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-navy-900 dark:text-white">Mock Test Creator</h2>
        <Button onClick={() => handleOpenModal()}>
          <i className="fa-solid fa-plus mr-1" /> Create Test
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tests.map((t) => {
          const attempts = testResults.filter((r) => r.testId === t.id).length;
          return (
            <div key={t.id} className="bg-white dark:bg-navy-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-navy-900 dark:text-white">{t.title}</h4>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(t)} className="text-blue-500 hover:text-blue-600 text-sm">
                    <i className="fa-solid fa-pen-to-square" />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-600 text-sm">
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span>
                  <i className="fa-regular fa-clock mr-1" />
                  {t.timeLimit} min
                </span>
                <span>
                  <i className="fa-solid fa-list-ol mr-1" />
                  {t.questions.length} questions
                </span>
                <span>
                  <i className="fa-solid fa-users mr-1" />
                  {attempts} attempts
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {t.questions.slice(0, 5).map((_, i) => (
                  <span key={i} className="w-6 h-6 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-[10px] font-bold flex items-center justify-center">
                    Q{i + 1}
                  </span>
                ))}
                {t.questions.length > 5 && (
                  <span className="w-6 h-6 bg-gray-100 dark:bg-navy-800 text-gray-500 rounded text-[10px] font-bold flex items-center justify-center">
                    +{t.questions.length - 5}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {tests.length === 0 && (
        <div className="col-span-2 text-center py-12 text-gray-500 dark:text-gray-400">
          <i className="fa-solid fa-file-lines text-4xl mb-3 opacity-30" />
          <p>No tests created yet</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTest ? 'Edit Test' : 'Create Test'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input label="Test Title" value={formData.title} onChange={(e) => { setFormData({ ...formData, title: e.target.value }); setErrors({ ...errors, title: '' }); }} required />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <Input label="Time Limit (minutes)" type="number" value={formData.timeLimit || ''} onChange={(e) => { setFormData({ ...formData, timeLimit: e.target.value === '' ? '' : parseInt(e.target.value) }); setErrors({ ...errors, timeLimit: '' }); }} required />
            {errors.timeLimit && <p className="text-red-500 text-xs mt-1">{errors.timeLimit}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Questions</label>
            {formData.questions.map((q, i) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-navy-800/50 rounded-xl space-y-3 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-navy-900 dark:text-white">Question {i + 1}</span>
                  {i > 0 && (
                    <button type="button" onClick={() => removeQuestion(i)} className="text-red-500 text-xs hover:text-red-600">
                      <i className="fa-solid fa-trash" />
                    </button>
                  )}
                </div>
                <select
                  value={q.type || 'mcq'}
                  onChange={(e) => updateQuestion(i, 'type', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-navy-800 text-sm text-gray-900 dark:text-white"
                >
                  <option value="mcq">Multiple Choice (MCQ)</option>
                  <option value="writing">Writing</option>
                </select>
                <Input
                  value={q.question}
                  onChange={(e) => updateQuestion(i, 'question', e.target.value)}
                  placeholder="Enter question"
                  className="text-sm"
                />
                <Input
                  value={q.image || ''}
                  onChange={(e) => updateQuestion(i, 'image', e.target.value)}
                  placeholder="Image URL (optional)"
                  className="text-sm"
                />
                {q.image && (
                  <img src={q.image} alt="Question" className="w-full h-32 object-cover rounded-lg" />
                )}
                {q.type === 'mcq' ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, optIndex) => (
                        <Input
                          key={optIndex}
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...q.options];
                            newOptions[optIndex] = e.target.value;
                            updateQuestion(i, 'options', newOptions);
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                          className="text-sm"
                        />
                      ))}
                    </div>
                    <select
                      value={q.correctAnswer}
                      onChange={(e) => updateQuestion(i, 'correctAnswer', parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-navy-800 text-sm text-gray-900 dark:text-white"
                    >
                      <option value={0}>Correct: Option A</option>
                      <option value={1}>Correct: Option B</option>
                      <option value={2}>Correct: Option C</option>
                      <option value={3}>Correct: Option D</option>
                    </select>
                  </>
                ) : (
                  <Input
                    label="Word Limit"
                    type="number"
                    value={q.wordLimit || 300}
                    onChange={(e) => updateQuestion(i, 'wordLimit', parseInt(e.target.value))}
                    placeholder="Word limit (e.g., 300)"
                    className="text-sm"
                  />
                )}
              </div>
            ))}
            <button type="button" onClick={addQuestion} className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors">
              <i className="fa-solid fa-plus mr-1" /> Add Question
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : (editingTest ? 'Update' : 'Create') + ' Test'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Test">
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">Are you sure you want to delete this test? All associated results will also be deleted.</p>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setDeleteModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="button" onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeacherTests;
