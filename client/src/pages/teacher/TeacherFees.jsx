import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toast from '../../components/ui/Toast';

const TeacherFees = () => {
  const { students, fees, addFee, updateFee, deleteFee } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    description: '',
    amount: '',
    dueDate: '',
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const paid = fees.filter((f) => f.status === 'paid').reduce((s, f) => s + f.amount, 0);
  const pending = fees.filter((f) => f.status === 'pending').reduce((s, f) => s + f.amount, 0);

  const handleOpenModal = () => {
    setFormData({
      studentId: '',
      description: '',
      amount: '',
      dueDate: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addFee({
      ...formData,
      amount: parseInt(formData.amount),
      status: 'pending',
    });
    setIsModalOpen(false);
  };

  const handleToggleStatus = (id) => {
    const fee = fees.find((f) => f.id === id);
    if (fee) {
      updateFee(id, { status: fee.status === 'paid' ? 'pending' : 'paid' });
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this fee?')) {
      deleteFee(id);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-navy-900 dark:text-white">Fee Management</h2>
        <Button onClick={handleOpenModal}>
          <i className="fa-solid fa-plus mr-1" /> Generate Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-navy-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Collected</p>
          <p className="text-xl font-black text-emerald-600">₹{paid.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-navy-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pending Amount</p>
          <p className="text-xl font-black text-amber-600">₹{pending.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-navy-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Billed</p>
          <p className="text-xl font-black text-navy-900 dark:text-white">₹{(paid + pending).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-navy-800/50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Student</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                  Description
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">
                  Due Date
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((f) => {
                  const student = students.find((s) => s.id === f.studentId);
                  const isOverdue = f.status === 'pending' && new Date(f.dueDate) < new Date();
                  const statusClass = isOverdue
                    ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                    : f.status === 'paid'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
                  const statusText = isOverdue ? 'Overdue' : f.status === 'paid' ? 'Paid' : 'Pending';
                  return (
                    <tr
                      key={f.id}
                      className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-navy-800/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleStudentClick(student)}
                          className="font-medium text-navy-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {student?.name || 'Unknown'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{f.description}</td>
                      <td className="px-4 py-3 font-semibold text-navy-900 dark:text-white">₹{f.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">{f.dueDate}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusClass}`}>{statusText}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleToggleStatus(f.id)} className="text-xs font-semibold text-blue-500 hover:text-blue-600 mr-2">
                          {f.status === 'paid' ? 'Mark Pending' : 'Mark Paid'}
                        </button>
                        <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:text-red-600 text-xs">
                          <i className="fa-solid fa-trash" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate Invoice">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Student</label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-navy-800 text-sm text-gray-900 dark:text-white"
              required
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <Input label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          <Input label="Amount (₹)" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
          <Input label="Due Date" type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} required />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Generate Invoice
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isBillModalOpen} onClose={() => setIsBillModalOpen(false)} title="Student Fee Bill">
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <img src={selectedStudent.photoUrl} alt={selectedStudent.name} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h3 className="text-lg font-bold text-navy-900 dark:text-white">{selectedStudent.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedStudent.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedStudent.phone}</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-navy-800 rounded-lg p-4">
              <h4 className="font-semibold text-navy-900 dark:text-white mb-3">Fee History</h4>
              {fees.filter(f => f.studentId === selectedStudent.id).length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No fee records found</p>
              ) : (
                <div className="space-y-2">
                  {fees
                    .filter(f => f.studentId === selectedStudent.id)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((f) => {
                      const isOverdue = f.status === 'pending' && new Date(f.dueDate) < new Date();
                      const statusClass = isOverdue
                        ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                        : f.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
                      const statusText = isOverdue ? 'Overdue' : f.status === 'paid' ? 'Paid' : 'Pending';
                      return (
                        <div key={f.id} className="flex items-center justify-between p-3 bg-white dark:bg-navy-900 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-navy-900 dark:text-white">{f.description}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Due: {f.dueDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-navy-900 dark:text-white">₹{f.amount.toLocaleString()}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${statusClass}`}>{statusText}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
              <span className="text-lg font-bold text-navy-900 dark:text-white">
                ₹{fees.filter(f => f.studentId === selectedStudent.id).reduce((sum, f) => sum + f.amount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default TeacherFees;
