import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';

const Courses = () => {
  const { courses } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    if (courses.length === 0) {
      // Default courses if none in storage
      const defaultCourses = [
        { id: 'cr1', title: 'Full Stack Web Development', cat: 'Technology', duration: '6 Months', price: '25,000', img: 'https://placehold.co/600x400/0f172a/22d3ee?text=Web+Dev' },
        { id: 'cr2', title: 'Data Science & Analytics', cat: 'Technology', duration: '4 Months', price: '20,000', img: 'https://placehold.co/600x400/0f172a/fb923c?text=Data+Sci' },
        { id: 'cr3', title: 'Digital Marketing Mastery', cat: 'Business', duration: '3 Months', price: '15,000', img: 'https://placehold.co/600x400/0f172a/22d3ee?text=Marketing' },
        { id: 'cr4', title: 'Business Analytics & MBA Prep', cat: 'Business', duration: '5 Months', price: '30,000', img: 'https://placehold.co/600x400/0f172a/fb923c?text=MBA+Prep' },
        { id: 'cr5', title: 'UI/UX Design Certificate', cat: 'Design', duration: '4 Months', price: '18,000', img: 'https://placehold.co/600x400/0f172a/22d3ee?text=UI+UX' },
        { id: 'cr6', title: 'English Communication & IELTS', cat: 'Language', duration: '2 Months', price: '10,000', img: 'https://placehold.co/600x400/0f172a/fb923c?text=IELTS' },
      ];
      setFilteredCourses(defaultCourses);
    } else {
      setFilteredCourses(courses);
    }
  }, [courses]);

  useEffect(() => {
    if (courses.length > 0) {
      if (selectedCategory === 'All') {
        setFilteredCourses(courses);
      } else {
        setFilteredCourses(courses.filter(c => c.cat === selectedCategory));
      }
    }
  }, [selectedCategory, courses]);

  const categories = ['All', ...new Set(filteredCourses.map(c => c.cat))];

  return (
    <section id="courses" className="py-20 lg:py-28 bg-white dark:bg-navy-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up visible">
          <span className="inline-block px-4 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full mb-4">
            Our Courses
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 dark:text-white mb-4">
            Courses Available
          </h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300 hover:bg-blue-500/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-navy-900 rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={course.img}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 dark:bg-navy-900/90 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400">
                  {course.cat}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-navy-900 dark:text-white mb-2">
                  {course.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    <i className="fa-regular fa-clock mr-1" />
                    {course.duration}
                  </span>
                  <span className="text-lg font-black text-cta-500">
                    ₹{course.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
