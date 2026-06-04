import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = ({ isLoggedIn, userRole }) => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (userRole === 'teacher') {
      navigate('/teacher/dashboard');
    } else if (userRole === 'student') {
      navigate('/student/dashboard');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-cta-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="fade-in-up visible">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <i className="fa-solid fa-graduation-cap text-white text-2xl" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              EduConsult Pro
            </h1>
          </div>
          
          {isLoggedIn ? (
            <>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                Welcome Back, {userRole === 'teacher' ? 'Teacher' : 'Student'}!
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Continue your educational journey. Access your dashboard to manage students, track attendance, view fees, and more.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleDashboardClick}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 text-lg"
                >
                  <i className={`fa-solid ${userRole === 'teacher' ? 'fa-chalkboard-user' : 'fa-user-graduate'} mr-2`} />
                  Go to Dashboard
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                Empowering Your Educational Journey
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Comprehensive consultancy management solutions for students and educators. 
                Streamline admissions, track progress, and achieve your goals.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 text-lg"
                >
                  <i className="fa-solid fa-user-graduate mr-2" />
                  Student Login
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all hover:-translate-y-0.5 text-lg"
                >
                  <i className="fa-solid fa-chalkboard-user mr-2" />
                  Teacher Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <i className="fa-solid fa-chevron-down text-white/40 text-xl" />
      </div>
    </section>
  );
};

export default Hero;
