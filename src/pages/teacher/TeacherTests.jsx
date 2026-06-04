import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const TeacherTests = () => {
  const { tests, testResults, addTest, updateTest, deleteTest } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    timeLimit: 15,
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }],
  });

  const handleOpenModal = (test = null) => {
    if (test) {
      setEditingTest(test);
      setFormData(test);
    } else {
      setEditingTest(null);
      setFormData({
        title: '',
        timeLimit: 15,
        questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }],
      });
    }
    setIsModalOpen(true);
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }],
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
    if (editingTest) {
      updateTest(editingTest.id, formData);
    } else {
      addTest(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this test? All associated results will also be deleted.')) {
      deleteTest(id);
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
          <Input label="Test Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <Input label="Time Limit (minutes)" type="number" value={formData.timeLimit} onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })} required />
          
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
                <Input
                  value={q.question}
                  onChange={(e) => updateQuestion(i, 'question', e.target.value)}
                  placeholder="Enter question"
                  className="text-sm"
                />
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
            <Button type="submit" className="flex-1">
              {editingTest ? 'Update' : 'Create'} Test
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeacherTests;
