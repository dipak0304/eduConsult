import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Toast from '../components/ui/Toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useData();
  const [selectedRole, setSelectedRole] = useState(null);
  const [teacherForm, setTeacherForm] = useState({ username: '', password: '' });
  const [studentForm, setStudentForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: request, 2: reset
  const [resetForm, setResetForm] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
  const [resetMessage, setResetMessage] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!studentForm.email.trim()) newErrors.email = 'Email is required';
    if (!studentForm.password.trim()) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/auth/student-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: studentForm.email, 
          password: studentForm.password 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        login('student', data.student.fullName, data.student.id);
        navigate('/student/dashboard');
      } else {
        setErrors({ login: data.message || 'Invalid credentials' });
      }
    } catch (error) {
      setErrors({ login: 'Failed to login. Please try again.' });
    }
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!resetForm.email.trim()) newErrors.email = 'Email is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSendingOTP(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetForm.email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResetMessage(data.message);
        setResetStep(2);
        setResetForm(prev => ({ ...prev, otp: '', newPassword: '', confirmPassword: '' }));
        setToast({ show: true, message: data.message, type: 'success' });
      } else {
        setErrors({ reset: data.message || 'Failed to request password reset' });
        setToast({ show: true, message: data.message || 'Failed to request password reset', type: 'error' });
      }
    } catch (error) {
      setErrors({ reset: 'Failed to request password reset' });
      setToast({ show: true, message: 'Failed to request password reset', type: 'error' });
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!resetForm.email.trim()) newErrors.email = 'Email is required';
    if (!resetForm.otp.trim()) newErrors.otp = 'OTP is required';
    if (!resetForm.newPassword.trim()) newErrors.newPassword = 'New password is required';
    if (resetForm.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (resetForm.newPassword !== resetForm.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: resetForm.email,
          otp: resetForm.otp, 
          newPassword: resetForm.newPassword 
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setToast({ show: true, message: data.message, type: 'success' });
        setShowForgotPassword(false);
        setResetStep(1);
        setResetForm({ email: '', otp: '', newPassword: '', confirmPassword: '' });
        setResetMessage('');
      } else {
        setErrors({ reset: data.message });
        setToast({ show: true, message: data.message, type: 'error' });
      }
    } catch (error) {
      setErrors({ reset: 'Failed to reset password' });
      setToast({ show: true, message: 'Failed to reset password', type: 'error' });
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

        {selectedRole === 'student' && !showForgotPassword && (
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
                    label="Email"
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    error={errors.email}
                    placeholder="Enter your email"
                  />
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showStudentPassword ? 'text' : 'password'}
                      value={studentForm.password}
                      onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                      error={errors.password}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowStudentPassword(!showStudentPassword)}
                      className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <i className={`fa-solid ${showStudentPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                    </button>
                  </div>
                  {errors.login && (
                    <p className="text-red-500 text-xs">{errors.login}</p>
                  )}
                  <Button variant="secondary" type="submit" className="w-full">
                    Login as Student
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="w-full text-sm text-blue-500 hover:text-blue-600 mt-2"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showForgotPassword && (
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-navy-900 rounded-2xl p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetStep(1);
                  setResetForm({ email: '', otp: '', newPassword: '', confirmPassword: '' });
                  setResetMessage('');
                  setErrors({});
                  setShowStudentPassword(false);
                  setShowNewPassword(false);
                  setShowConfirmPassword(false);
                }}
                className="text-gray-500 hover:text-navy-900 dark:hover:text-white mb-6 flex items-center gap-2 text-sm font-semibold transition-colors"
              >
                <i className="fa-solid fa-arrow-left" /> Back
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cta-500 to-cta-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cta-500/30">
                  <i className="fa-solid fa-key text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-white">
                  {resetStep === 1 ? 'Forgot Password' : 'Reset Password'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {resetStep === 1 ? 'Enter your email to receive a reset link' : 'Enter the token and your new password'}
                </p>
              </div>
              
              {resetStep === 1 ? (
                <form onSubmit={handleRequestReset}>
                  <div className="space-y-4">
                    <Input
                      label="Email"
                      type="email"
                      value={resetForm.email}
                      onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })}
                      error={errors.email}
                      placeholder="Enter your email"
                    />
                    {errors.reset && (
                      <p className="text-red-500 text-xs">{errors.reset}</p>
                    )}
                    {resetMessage && (
                      <p className="text-emerald-500 text-xs">{resetMessage}</p>
                    )}
                    <Button type="submit" className="w-full" disabled={isSendingOTP}>
                      {isSendingOTP ? 'Sending...' : 'Send OTP'}
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <div className="space-y-4">
                    <Input
                      label="OTP"
                      value={resetForm.otp}
                      onChange={(e) => setResetForm({ ...resetForm, otp: e.target.value })}
                      error={errors.otp}
                      placeholder="Enter the 6-digit OTP"
                      maxLength={6}
                    />
                    <div className="relative">
                      <Input
                        label="New Password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={resetForm.newPassword}
                        onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                        error={errors.newPassword}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <i className={`fa-solid ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={resetForm.confirmPassword}
                        onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
                        error={errors.confirmPassword}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                      </button>
                    </div>
                    {errors.reset && (
                      <p className="text-red-500 text-xs">{errors.reset}</p>
                    )}
                    <Button type="submit" className="w-full">
                      Reset Password
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

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

export default Login;
