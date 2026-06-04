import React from 'react';

const Services = () => {
  const services = [
    {
      icon: 'fa-graduation-cap',
      title: 'Career Counseling',
      description: 'Personalized career guidance based on aptitude, interests, and market trends to help you choose the right path.',
    },
    {
      icon: 'fa-book-open',
      title: 'Course Selection',
      description: 'Expert assistance in selecting the best courses and institutions aligned with your academic goals.',
    },
    {
      icon: 'fa-file-alt',
      title: 'Documentation Help',
      description: 'Complete support for application forms, SOPs, essays, and all admission documentation.',
    },
    {
      icon: 'fa-chart-line',
      title: 'Skill Assessment',
      description: 'Comprehensive evaluation of your skills and knowledge to identify strengths and improvement areas.',
    },
    {
      icon: 'fa-globe',
      title: 'Global Opportunities',
      description: 'Access to international education opportunities, scholarships, and exchange programs worldwide.',
    },
    {
      icon: 'fa-hands-helping',
      title: 'Post-Admission Support',
      description: 'Ongoing support even after admission including accommodation, visa, and settling-in assistance.',
    },
  ];

  return (
    <section id="services" className="py-20 lg:py-28 bg-gray-50 dark:bg-navy-900/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up visible">
          <span className="inline-block px-4 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full mb-4">
            Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 dark:text-white mb-4">
            What We Offer
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            End-to-end consultancy solutions designed to help students and educators achieve their goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="fade-in-up visible bg-white dark:bg-navy-900 rounded-2xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-all duration-300 group"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                <i className={`fa-solid ${service.icon} text-white text-xl`} />
              </div>
              <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
