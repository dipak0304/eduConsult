import React, { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';

const StudentFees = ({ student }) => {
  const { fees } = useData();
  const [studentFees, setStudentFees] = useState([]);
  const totalPending = studentFees.filter(f => f.status === 'pending').reduce((s, f) => s + f.amount, 0);

  useEffect(() => {
    setStudentFees(fees.filter(f => f.studentId === student.id));
  }, [fees, student.id]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">Fee Status</h2>
      
      {totalPending > 0 && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
          <i className="fa-solid fa-exclamation-triangle text-amber-500" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            You have <strong>₹{totalPending.toLocaleString()}</strong> in pending fees.
          </p>
        </div>
      )}
      
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-navy-800/50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Description</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">Due Date</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {studentFees
                .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
                .map((f) => {
                  const isOverdue = f.status === 'pending' && new Date(f.dueDate) < new Date();
                  const cls = isOverdue
                    ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                    : f.status === 'paid'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
                  const txt = isOverdue ? 'Overdue' : f.status === 'paid' ? 'Paid' : 'Pending';
                  return (
                    <tr key={f.id} className="border-b border-gray-50 dark:border-gray-800/50">
                      <td className="px-4 py-3 font-medium text-navy-900 dark:text-white">{f.description}</td>
                      <td className="px-4 py-3 font-semibold text-navy-900 dark:text-white">₹{f.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{f.dueDate}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${cls}`}>{txt}</span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        {studentFees.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <i className="fa-solid fa-money-bill text-3xl mb-2 opacity-30" />
            <p>No fee records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentFees;
