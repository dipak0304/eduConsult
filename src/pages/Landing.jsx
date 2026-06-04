import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/landing/Hero';
import Services from '../components/landing/Services';
import WhyUs from '../components/landing/WhyUs';
import Testimonials from '../components/landing/Testimonials';
import Courses from '../components/landing/Courses';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';

const Landing = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { session, logout } = useData();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Services', section: 'services' },
    { label: 'Why Us', section: 'why-us' },
    { label: 'Courses', section: 'courses' },
    { label: 'Contact', section: 'contact' },
  ];

  const handleDashboardClick = () => {
    if (session?.role === 'teacher') {
      navigate('/teacher/dashboard');
    } else if (session?.role === 'student') {
      navigate('/student/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.section);
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 left-0 right-0 z-[9999] h-16 bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-gray-800 md:bg-white/80 md:dark:bg-navy-900/80 md:backdrop-blur-md">
        <div className="h-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-graduation-cap text-white text-sm" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-navy-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
                EduConsult Pro
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.section}
                  onClick={() => scrollToSection(link.section)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === link.section
                      ? 'text-orange-600 dark:text-orange-400 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              {session ? (
                <>
                  <button
                    onClick={handleDashboardClick}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-blue-600 transition-all"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-blue-600 transition-all"
                >
                  Login
                </button>
              )}
              <button
                onClick={toggleDarkMode}
                className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-navy-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-700 transition-colors"
              >
                <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`} />
              </button>
            </div>

            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-navy-800 flex items-center justify-center text-gray-600 dark:text-gray-300"
              >
                <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 bottom-0 md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-900 overflow-y-auto shadow-lg z-[99] max-h-[calc(100dvh-4rem)]">
          <div className="px-4 sm:px-6 lg:px-8 py-3">
              {navLinks.map((link) => (
                <button
                  key={link.section}
                  onClick={() => scrollToSection(link.section)}
                  className={`block w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                    activeSection === link.section
                      ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              {session ? (
                <>
                  <button
                    onClick={handleDashboardClick}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Login
                </button>
              )}
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                <i className={`fa-solid ${darkMode ? 'fa-sun' : 'fa-moon'}`} />
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        )}

      <div className="pt-16">
        <div id="hero">
          <Hero isLoggedIn={!!session} userRole={session?.role} />
        </div>
        <Services />
        <WhyUs />
        <Testimonials />
        <Courses />
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
