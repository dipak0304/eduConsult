import React from 'react';
import { useData } from '../../context/DataContext';

const TeacherOverview = () => {
  const { students, fees, attendance } = useData();

  const totalStudents = students.length;
  const pendingFees = fees.filter(f => f.status === 'pending').reduce((s, f) => s + f.amount, 0);
  const totalRevenue = fees.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0);
  const today = new Date().toISOString().split('T')[0];
  const todayAtt = attendance.filter(a => a.date === today);
  const presentToday = todayAtt.filter(a => a.status === 'present').length;
  const attPercent = todayAtt.length ? Math.round((presentToday / todayAtt.length) * 100) : 0;
  const paidCount = fees.filter(f => f.status === 'paid').length;
  const pendingCount = fees.filter(f => f.status === 'pending').length;
  const totalFeesCount = fees.length || 1;
  const paidPct = Math.round((paidCount / totalFeesCount) * 100);
  const pendingPct = Math.round((pendingCount / totalFeesCount) * 100);

  const admittedStudents = students.filter(s => {
    const sFees = fees.filter(f => f.studentId === s.id);
    return sFees.length > 0 && sFees.every(f => f.status === 'paid');
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-navy-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-users text-blue-500" />
            </div>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <p className="text-2xl font-black text-navy-900 dark:text-white">{totalStudents}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Students</p>
        </div>

        <div className="bg-white dark:bg-navy-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-clock text-amber-500" />
            </div>
            <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
              Pending
            </span>
          </div>
          <p className="text-2xl font-black text-navy-900 dark:text-white">₹{pendingFees.toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Pending Fees</p>
        </div>

        <div className="bg-white dark:bg-navy-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-calendar-check text-emerald-500" />
            </div>
            <span className="text-xs font-medium text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
              Today
            </span>
          </div>
          <p className="text-2xl font-black text-navy-900 dark:text-white">{attPercent}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Attendance Today</p>
        </div>

        <div className="bg-white dark:bg-navy-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-indian-rupee-sign text-blue-500" />
            </div>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Collected
            </span>
          </div>
          <p className="text-2xl font-black text-navy-900 dark:text-white">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-navy-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="font-bold text-navy-900 dark:text-white mb-4">Fee Collection Status</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `conic-gradient(#10b981 0% ${paidPct}%, #f59e0b ${paidPct}% ${paidPct + pendingPct}%, #e5e7eb ${paidPct + pendingPct}% 100%)`,
                }}
              />
              <div className="absolute inset-3 bg-white dark:bg-navy-900 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-navy-900 dark:text-white">{paidPct}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Paid ({paidCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending ({pendingCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Total ({fees.length})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-navy-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="font-bold text-navy-900 dark:text-white mb-4">Recent Students</h3>
          <div className="space-y-1">
            {students.slice(-4).reverse().map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 p-2 -mx-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-800/50 transition-colors"
              >
                <img src={s.photoUrl} alt={s.name} className="w-9 h-9 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-900 dark:text-white truncate">{s.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.qualification}</p>
                </div>
                <span className="text-xs text-gray-400">{s.phone}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-navy-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="font-bold text-navy-900 dark:text-white mb-4">Admitted Students</h3>
          <div className="space-y-1">
            {admittedStudents.slice(-4).reverse().map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 p-2 -mx-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-800/50 transition-colors"
              >
                <img src={s.photoUrl} alt={s.name} className="w-9 h-9 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-900 dark:text-white truncate">{s.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{s.qualification}</p>
                </div>
                <span className="text-xs text-emerald-500 font-bold">Paid</span>
              </div>
            ))}
            {admittedStudents.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No fully paid students</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherOverview;
