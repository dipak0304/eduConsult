import React, { useEffect, useRef } from 'react';

const WhyUs = () => {
  const statsRef = useRef(null);

  const stats = [
    { icon: 'fa-users', value: 500, label: 'Students Placed' },
    { icon: 'fa-university', value: 50, label: 'Partner Institutes' },
    { icon: 'fa-trophy', value: 95, suffix: '%', label: 'Success Rate' },
    { icon: 'fa-clock', value: 10, suffix: '+', label: 'Years Experience' },
  ];

  return (
    <section id="why-us" className="py-20 lg:py-28 bg-white dark:bg-navy-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up visible">
          <span className="inline-block px-4 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 dark:text-white mb-4">
            Numbers That Speak
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our track record of excellence in education consultancy.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="fade-in-up visible text-center bg-gray-50 dark:bg-navy-900/50 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className={`fa-solid ${stat.icon} text-blue-500 text-xl`} />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-navy-900 dark:text-white counter">
                0{stat.suffix || '+'}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
