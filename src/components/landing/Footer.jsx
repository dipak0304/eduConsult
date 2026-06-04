import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-navy-900 dark:bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-graduation-cap text-white text-sm" />
              </div>
              <span className="text-xl font-bold">EduConsult Pro</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering students and educators with comprehensive consultancy management solutions since 2015.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <button
                onClick={() => scrollToSection('services')}
                className="block text-gray-400 text-sm hover:text-blue-400 cursor-pointer transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('courses')}
                className="block text-gray-400 text-sm hover:text-blue-400 cursor-pointer transition-colors"
              >
                Courses
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="block text-gray-400 text-sm hover:text-blue-400 cursor-pointer transition-colors"
              >
                Contact
              </button>
              <button
                onClick={() => navigate('/login')}
                className="block text-gray-400 text-sm hover:text-blue-400 cursor-pointer transition-colors"
              >
                Login
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                <i className="fa-brands fa-facebook-f text-sm" />
              </a>
              <a className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                <i className="fa-brands fa-twitter text-sm" />
              </a>
              <a className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                <i className="fa-brands fa-instagram text-sm" />
              </a>
              <a className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                <i className="fa-brands fa-linkedin-in text-sm" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          © 2025 EduConsult Pro. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
