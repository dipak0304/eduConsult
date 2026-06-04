import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Placed at Google',
      image: 'https://placehold.co/100x100/0f172a/22d3ee?text=RS',
      text: 'EduConsult Pro transformed my career trajectory. Their personalized guidance helped me land my dream job at a top tech company.',
    },
    {
      name: 'Priya Patel',
      role: 'MS at MIT',
      image: 'https://placehold.co/100x100/0f172a/fb923c?text=PP',
      text: 'The documentation support and visa guidance were exceptional. I couldnt have navigated the complex admission process without them.',
    },
    {
      name: 'Amit Kumar',
      role: 'MBA at IIM',
      image: 'https://placehold.co/100x100/0f172a/22d3ee?text=AK',
      text: 'From course selection to interview preparation, every step was meticulously planned. Truly a game-changer for my career.',
    },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-gray-50 dark:bg-navy-900/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up visible">
          <span className="inline-block px-4 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 dark:text-white mb-4">
            What Our Students Say
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="fade-in-up visible bg-white dark:bg-navy-900 rounded-2xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <i className="fa-solid fa-quote-left text-3xl text-blue-500/20 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                {testimonial.text}
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-navy-900 dark:text-white text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
