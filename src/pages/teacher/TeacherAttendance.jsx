import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Button from '../../components/ui/Button';

const TeacherAttendance = () => {
  const { students, attendance, addAttendance } = useData();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData({ ...attendanceData, [studentId]: status });
  };

  const handleSave = () => {
    let saved = 0;
    students.forEach((s) => {
      const status = attendanceData[s.id];
      if (status) {
        addAttendance({
          studentId: s.id,
          date,
          status,
        });
        saved++;
      }
    });

    if (saved === 0) {
      alert('Please mark attendance for at least one student');
      return;
    }

    alert(`Attendance saved for ${saved} students`);
    setAttendanceData({});
  };

  const getExistingStatus = (studentId) => {
    const existing = attendance.find((a) => a.studentId === studentId && a.date === date);
    return existing ? existing.status : null;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-navy-900 dark:text-white">Attendance Tracker</h2>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-navy-800 text-sm text-gray-900 dark:text-white"
          />
          <Button onClick={handleSave}>
            <i className="fa-solid fa-check mr-1" /> Save
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-navy-800/50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Student</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Present</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Absent</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Tardy</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const existingStatus = getExistingStatus(s.id);
                const currentStatus = attendanceData[s.id] || existingStatus;
                return (
                  <tr key={s.id} className="border-b border-gray-50 dark:border-gray-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={s.photoUrl} alt={s.name} className="w-8 h-8 rounded-full object-cover" />
                        <span className="font-medium text-navy-900 dark:text-white">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="radio"
                        name={`att-${s.id}`}
                        checked={currentStatus === 'present'}
                        onChange={() => handleAttendanceChange(s.id, 'present')}
                        className="w-4 h-4 text-emerald-500 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="radio"
                        name={`att-${s.id}`}
                        checked={currentStatus === 'absent'}
                        onChange={() => handleAttendanceChange(s.id, 'absent')}
                        className="w-4 h-4 text-red-500 focus:ring-red-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="radio"
                        name={`att-${s.id}`}
                        checked={currentStatus === 'tardy'}
                        onChange={() => handleAttendanceChange(s.id, 'tardy')}
                        className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {students.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>No students to mark attendance</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAttendance;
