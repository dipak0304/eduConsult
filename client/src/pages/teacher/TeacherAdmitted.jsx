import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

const TeacherAdmitted = () => {
  const { students, fees } = useData();
  const [search, setSearch] = useState('');

  const admittedStudents = students.filter((s) => {
    const sFees = fees.filter((f) => f.studentId === s.id);
    return sFees.length > 0 && sFees.every((f) => f.status === 'paid');
  });

  const filtered = admittedStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search)
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-navy-900 dark:text-white">Admitted Students</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search admitted students..."
          className="flex-1 sm:w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-navy-800 text-sm text-gray-900 dark:text-white"
        />
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-navy-800/50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Student</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">
                  Phone
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                  Enrolled Class
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-navy-800/30 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={s.photoUrl} alt={s.name} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-navy-900 dark:text-white">{s.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 md:hidden">{s.phone}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 lg:hidden">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">{s.phone}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden lg:table-cell">{s.email}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{s.assignedClass || 'N/A'}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                      Paid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <i className="fa-solid fa-user-check text-3xl mb-2 opacity-30" />
            <p>No admitted students found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAdmitted;
