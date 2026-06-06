import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const Courses = () => {
  const { courses, fetchCourses, addCourse, session } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    cat: 'Technology',
    duration: '',
    price: '',
    img: '',
    description: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCourse(formData);
      setIsModalOpen(false);
      setFormData({
        title: '',
        cat: 'Technology',
        duration: '',
        price: '',
        img: '',
        description: ''
      });
    } catch (error) {
      alert(error.message || 'Failed to add course');
    }
  };

  return (
    <section id="courses" className="py-20 lg:py-28 bg-white dark:bg-navy-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up visible">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-block px-4 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full">
              Our Courses
            </span>
            {session?.role === 'teacher' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                <i className="fa-solid fa-plus mr-2" /> Add Course
              </button>
            )}
          </div>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Course">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Course Title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter course title"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                value={formData.cat}
                onChange={(e) => setFormData({ ...formData, cat: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
                required
              >
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
                <option value="Language">Language</option>
              </select>
            </div>
            <Input
              label="Duration"
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g., 6 Months"
              required
            />
            <Input
              label="Price"
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="e.g., 25,000"
              required
            />
            <Input
              label="Image URL"
              type="text"
              value={formData.img}
              onChange={(e) => setFormData({ ...formData, img: e.target.value })}
              placeholder="Enter image URL"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter course description"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
              />
            </div>
            <Button type="submit" className="w-full">
              Add Course
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
};

export default Courses;
