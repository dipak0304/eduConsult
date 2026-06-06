import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import TeacherOverview from './TeacherOverview';
import TeacherStudents from './TeacherStudents';
import TeacherAdmitted from './TeacherAdmitted';
import TeacherFees from './TeacherFees';
import TeacherAttendance from './TeacherAttendance';
import TeacherTests from './TeacherTests';
import TeacherCourses from './TeacherCourses';
import ResultChecking from './ResultChecking';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { logout, session } = useData();
  const { darkMode, toggleDarkMode } = useTheme();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sections = [
    { id: 'overview', label: 'Dashboard', icon: 'fa-gauge-high' },
    { id: 'students', label: 'Students', icon: 'fa-users' },
    { id: 'admitted', label: 'Admitted', icon: 'fa-user-check' },
    { id: 'fees', label: 'Fees', icon: 'fa-indian-rupee-sign' },
    { id: 'attendance', label: 'Attendance', icon: 'fa-calendar-check' },
    { id: 'tests', label: 'Tests', icon: 'fa-file-lines' },
    { id: 'result-checking', label: 'Result Checking', icon: 'fa-clipboard-check' },
    { id: 'courses', label: 'Courses', icon: 'fa-book-open' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <TeacherOverview />;
      case 'students':
        return <TeacherStudents />;
      case 'admitted':
        return <TeacherAdmitted />;
      case 'fees':
        return <TeacherFees />;
      case 'attendance':
        return <TeacherAttendance />;
      case 'tests':
        return <TeacherTests />;
      case 'result-checking':
        return <ResultChecking />;
      case 'courses':
        return <TeacherCourses />;
      default:
        return <TeacherOverview />;
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
          <div className="flex items-center gap-2 px-3 py-3 mb-4 bg-blue-500/10 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-chalkboard-user text-white text-xs" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Logged in as</p>
              <p className="text-sm font-bold text-navy-900 dark:text-white">Teacher</p>
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
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800'
                }`}
              >
                <i
                  className={`fa-solid ${section.icon} w-5 text-center ${
                    activeSection === section.id ? 'text-blue-500' : 'text-gray-400'
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

export default TeacherDashboard;
