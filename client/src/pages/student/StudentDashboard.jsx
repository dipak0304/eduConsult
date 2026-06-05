import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import StudentProfile from './StudentProfile';
import StudentFees from './StudentFees';
import StudentClasses from './StudentClasses';
import StudentTests from './StudentTests';
import StudentAttendance from './StudentAttendance';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { logout, session, fetchStudentById, fetchStudentFees, fetchStudentAttendance } = useData();
  const { darkMode, toggleDarkMode } = useTheme();
  const [activeSection, setActiveSection] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      if (session?.studentId) {
        const studentData = await fetchStudentById(session.studentId);
        setStudent(studentData);
        // Fetch student-specific fees and attendance
        await fetchStudentFees(session.studentId);
        await fetchStudentAttendance(session.studentId);
      }
      setIsLoading(false);
    };
    loadStudent();
  }, [session?.studentId, fetchStudentById, fetchStudentFees, fetchStudentAttendance]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Student not found</p>
          <button onClick={handleLogout} className="text-blue-500 hover:text-blue-600">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cta-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'profile', label: 'My Profile', icon: 'fa-user' },
    { id: 'fees', label: 'Fee Status', icon: 'fa-money-bill' },
    { id: 'classes', label: 'My Classes', icon: 'fa-chalkboard-user' },
    { id: 'tests', label: 'Mock Tests', icon: 'fa-file-lines' },
    { id: 'attendance', label: 'Attendance', icon: 'fa-calendar-check' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <StudentProfile student={student} />;
      case 'fees':
        return <StudentFees student={student} />;
      case 'classes':
        return <StudentClasses student={student} />;
      case 'tests':
        return <StudentTests student={student} />;
      case 'attendance':
        return <StudentAttendance student={student} />;
      default:
        return <StudentProfile student={student} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-600 dark:text-gray-300"
        >
          <i className="fa-solid fa-bars text-xl" />
        </button>
        <span className="font-semibold text-navy-900 dark:text-white">
          {sections.find(s => s.id === activeSection)?.label}
        </span>
        <button onClick={toggleDarkMode} className="text-gray-600 dark:text-gray-300">
          <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-navy-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-4 flex-1">
          <div className="flex items-center gap-2 px-3 py-3 mb-4 bg-cta-500/10 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-cta-500 to-cta-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-user-graduate text-white text-xs" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Logged in as</p>
              <p className="text-sm font-bold text-navy-900 dark:text-white">Student</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors"
            >
              <i className="fa-solid fa-house w-5 text-center text-gray-400" />
              Back to Homepage
            </button>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-cta-500/10 text-cta-600 dark:text-cta-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800'
                }`}
              >
                <i
                  className={`fa-solid ${section.icon} w-5 text-center ${
                    activeSection === section.id ? 'text-cta-500' : 'text-gray-400'
                  }`}
                />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <i className="fa-solid fa-right-from-bracket w-5 text-center" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">{renderSection()}</div>
      </main>
    </div>
  );
};

export default StudentDashboard;
