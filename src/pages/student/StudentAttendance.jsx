import React from 'react';
import { useData } from '../../context/DataContext';

const StudentAttendance = ({ student }) => {
  const { attendance } = useData();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  
  const monthAtt = attendance.filter(a => {
    const d = new Date(a.date);
    return d.getFullYear() === year && d.getMonth() === month && a.studentId === student.id;
  });
  
  const presentCount = monthAtt.filter(a => a.status === 'present').length;
  const totalDays = monthAtt.length;
  const pct = totalDays ? Math.round((presentCount / totalDays) * 100) : 0;

  let calCells = '';
  for (let i = 0; i < firstDay; i++) {
    calCells += `<div class="aspect-square"></div>`;
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const rec = monthAtt.find(a => a.date === dateStr);
    const dayOfWeek = new Date(year, month, d).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isFuture = d > now.getDate();
    
    let bg = 'bg-gray-50 dark:bg-navy-800/30';
    let text = 'text-gray-400 dark:text-gray-600';
    
    if (isWeekend || isFuture) {
      bg = 'bg-gray-50 dark:bg-navy-800/20';
      text = 'text-gray-300 dark:text-gray-700';
    } else if (rec) {
      if (rec.status === 'present') {
        bg = 'bg-emerald-100 dark:bg-emerald-500/20';
        text = 'text-emerald-700 dark:text-emerald-400';
      } else if (rec.status === 'absent') {
        bg = 'bg-red-100 dark:bg-red-500/20';
        text = 'text-red-700 dark:text-red-400';
      } else {
        bg = 'bg-amber-100 dark:bg-amber-500/20';
        text = 'text-amber-700 dark:text-amber-400';
      }
    }
    
    calCells += `<div class="aspect-square ${bg} ${text} rounded-lg flex items-center justify-center text-sm font-medium">${d}</div>`;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">Attendance Summary</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-navy-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          <h3 className="font-bold text-navy-900 dark:text-white mb-4">{monthName}</h3>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1" dangerouslySetInnerHTML={{ __html: calCells }} />
        </div>
        
        <div className="space-y-4">
          <div className="bg-white dark:bg-navy-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Overall Attendance</p>
            <p className="text-3xl font-black text-navy-900 dark:text-white mb-3">{pct}%</p>
            <div className="w-full h-3 bg-gray-100 dark:bg-navy-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
            </div>
          </div>
          
          <div className="bg-white dark:bg-navy-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <h4 className="text-sm font-bold text-navy-900 dark:text-white mb-3">Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-500/20 rounded" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Present ({presentCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-100 dark:bg-red-500/20 rounded" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Absent ({monthAtt.filter(a => a.status === 'absent').length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-amber-100 dark:bg-amber-500/20 rounded" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Tardy ({monthAtt.filter(a => a.status === 'tardy').length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-50 dark:bg-navy-800/20 rounded" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Weekend / No Data</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-navy-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <h4 className="text-sm font-bold text-navy-900 dark:text-white mb-3">Quick Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Total Days</span>
                <span className="font-semibold text-navy-900 dark:text-white">{totalDays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Present</span>
                <span className="font-semibold text-emerald-600">{presentCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Absent</span>
                <span className="font-semibold text-red-600">{monthAtt.filter(a => a.status === 'absent').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
