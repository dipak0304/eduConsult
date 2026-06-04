import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const TeacherCourses = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useData();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    cat: '',
    duration: '',
    price: '',
    img: 'https://placehold.co/600x400/0f172a/22d3ee?text=Course',
  });

  const catCounts = {};
  courses.forEach((c) => {
    catCounts[c.cat] = (catCounts[c.cat] || 0) + 1;
  });

  const filteredCourses = courses.filter(
    (c) => c.title.toLowerCase().includes(search.toLowerCase()) || c.cat.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData(course);
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        cat: '',
        duration: '',
        price: '',
        img: 'https://placehold.co/600x400/0f172a/22d3ee?text=Course',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCourse) {
      updateCourse(editingCourse.id, formData);
    } else {
      addCourse(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this course?')) {
      deleteCourse(id);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-navy-900 dark:text-white">Course Management</h2>
        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="flex-1 sm:w-56 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-navy-800 text-sm text-gray-900 dark:text-white"
          />
          <Button onClick={() => handleOpenModal()}>
            <i className="fa-solid fa-plus mr-1" /> Add Course
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-navy-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Courses</p>
          <p className="text-xl font-black text-navy-900 dark:text-white">{courses.length}</p>
        </div>
        <div className="bg-white dark:bg-navy-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Categories</p>
          <p className="text-xl font-black text-blue-600">{Object.keys(catCounts).length}</p>
        </div>
        <div className="bg-white dark:bg-navy-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm lg:col-span-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">By Category</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {Object.entries(catCounts).map(([cat, cnt]) => (
              <span key={cat} className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {cat}: {cnt}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((c) => (
          <div key={c.id} className="bg-white dark:bg-navy-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
            <div className="relative h-40">
              <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/90 dark:bg-navy-900/90 rounded text-[10px] font-bold text-blue-600">
                {c.cat}
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-navy-900 dark:text-white text-sm mb-1 line-clamp-2">{c.title}</h3>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4 mt-auto">
                <span>
                  <i className="fa-regular fa-clock mr-1" />
                  {c.duration}
                </span>
                <span className="font-semibold text-cta-500">₹{c.price}</span>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button onClick={() => handleOpenModal(c)} className="flex-1 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-500/10 rounded hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                  <i className="fa-solid fa-pen mr-1" /> Edit
                </button>
                <button onClick={() => handleDelete(c.id)} className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-500/10 rounded hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                  <i className="fa-solid fa-trash mr-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <i className="fa-solid fa-book-open text-3xl mb-2 opacity-30" />
          <p>No courses found</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCourse ? 'Edit Course' : 'Add New Course'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Course Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Category" value={formData.cat} onChange={(e) => setFormData({ ...formData, cat: e.target.value })} required />
            <Input label="Duration (e.g. 3 Months)" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required />
          </div>
          <Input label="Price (₹)" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
          <Input label="Image URL" value={formData.img} onChange={(e) => setFormData({ ...formData, img: e.target.value })} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingCourse ? 'Update' : 'Add'} Course
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeacherCourses;
