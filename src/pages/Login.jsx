import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useData();
  const [selectedRole, setSelectedRole] = useState(null);
  const [teacherForm, setTeacherForm] = useState({ username: '', password: '' });
  const [studentForm, setStudentForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleTeacherLogin = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!teacherForm.username.trim()) newErrors.username = 'Username is required';
    if (!teacherForm.password.trim()) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Demo credentials: admin / admin123
    if (teacherForm.username === 'admin' && teacherForm.password === 'admin123') {
      login('teacher', teacherForm.username);
      navigate('/teacher/dashboard');
    } else {
      setErrors({ login: 'Invalid credentials. Use admin / admin123' });
    }
  };

  const handleStudentLogin = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!studentForm.username.trim()) newErrors.username = 'Username is required';
    if (!studentForm.password.trim()) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Demo credentials: rahul / rahul123
    if (studentForm.username === 'rahul' && studentForm.password === 'rahul123') {
      login('student', studentForm.username);
      navigate('/student/dashboard');
    } else {
      setErrors({ login: 'Invalid credentials. Use rahul / rahul123' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 flex items-center justify-center p-4 pt-16">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div
            className="flex items-center justify-center gap-2 mb-4 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-graduation-cap text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-navy-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
              EduConsult Pro
            </span>
          </div>
          <h2 className="text-2xl font-bold text-navy-900 dark:text-white">Welcome Back</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {selectedRole ? `Login as ${selectedRole}` : 'Choose your role to continue'}
          </p>
        </div>

        {!selectedRole && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedRole('teacher')}
              className="bg-white dark:bg-navy-900 rounded-2xl p-10 shadow-xl shadow-gray-200/50 dark:shadow-none border-2 border-transparent hover:border-blue-500/50 transition-all duration-300 flex flex-col items-center justify-center gap-6 group"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-chalkboard-user text-white text-4xl" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-navy-900 dark:text-white">Teacher</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Manage students, fees, and tests
                </p>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('student')}
              className="bg-white dark:bg-navy-900 rounded-2xl p-10 shadow-xl shadow-gray-200/50 dark:shadow-none border-2 border-transparent hover:border-cta-500/50 transition-all duration-300 flex flex-col items-center justify-center gap-6 group"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-cta-500 to-cta-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cta-500/30 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-user-graduate text-white text-4xl" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-navy-900 dark:text-white">Student</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  View profile, attendance, and tests
                </p>
              </div>
            </button>
          </div>
        )}

        {selectedRole === 'teacher' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-navy-900 rounded-2xl p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="text-gray-500 hover:text-navy-900 dark:hover:text-white mb-6 flex items-center gap-2 text-sm font-semibold transition-colors"
              >
                <i className="fa-solid fa-arrow-left" /> Back
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                  <i className="fa-solid fa-chalkboard-user text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-white">Teacher Login</h3>
              </div>
              
              <form onSubmit={handleTeacherLogin}>
                <div className="space-y-4">
                  <Input
                    label="Username"
                    value={teacherForm.username}
                    onChange={(e) => setTeacherForm({ ...teacherForm, username: e.target.value })}
                    error={errors.username}
                    placeholder="Enter username"
                  />
                  <Input
                    label="Password"
                    type="password"
                    value={teacherForm.password}
                    onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
                    error={errors.password}
                    placeholder="Enter password"
                  />
                  {errors.login && (
                    <p className="text-red-500 text-xs">{errors.login}</p>
                  )}
                  <Button type="submit" className="w-full">
                    Login as Teacher
                  </Button>
                </div>
              </form>
              <p className="text-xs text-gray-400 text-center mt-3">Demo: admin / admin123</p>
            </div>
          </div>
        )}

        {selectedRole === 'student' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-navy-900 rounded-2xl p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="text-gray-500 hover:text-navy-900 dark:hover:text-white mb-6 flex items-center gap-2 text-sm font-semibold transition-colors"
              >
                <i className="fa-solid fa-arrow-left" /> Back
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cta-500 to-cta-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cta-500/30">
                  <i className="fa-solid fa-user-graduate text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-white">Student Login</h3>
              </div>
              
              <form onSubmit={handleStudentLogin}>
                <div className="space-y-4">
                  <Input
                    label="Username"
                    value={studentForm.username}
                    onChange={(e) => setStudentForm({ ...studentForm, username: e.target.value })}
                    error={errors.username}
                    placeholder="Enter username"
                  />
                  <Input
                    label="Password"
                    type="password"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    error={errors.password}
                    placeholder="Enter password"
                  />
                  {errors.login && (
                    <p className="text-red-500 text-xs">{errors.login}</p>
                  )}
                  <Button variant="secondary" type="submit" className="w-full">
                    Login as Student
                  </Button>
                </div>
              </form>
              <p className="text-xs text-gray-400 text-center mt-3">Demo: rahul / rahul123</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
