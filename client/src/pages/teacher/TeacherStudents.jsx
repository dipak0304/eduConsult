import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const TeacherStudents = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useData();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: '',
    age: '',
    address: '',
    photoUrl: 'https://placehold.co/100x100/0f172a/22d3ee?text=Student',
    classes: [{ assignedClass: '', classTime: '' }],
  });

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search)
  );

  const handleOpenModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.fullName || student.name,
        email: student.email,
        phone: student.phone,
        qualification: student.qualification,
        age: student.age,
        address: student.address,
        photoUrl: student.photoUrl,
        classes: student.classes || [{ assignedClass: student.assignedClass || '', classTime: student.classTime || '' }],
      });
    } else {
      setEditingStudent(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        qualification: '',
        age: '',
        address: '',
        photoUrl: 'https://placehold.co/100x100/0f172a/22d3ee?text=Student',
        classes: [{ assignedClass: '', classTime: '' }],
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const studentData = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        qualification: formData.qualification,
        age: formData.age,
        address: formData.address,
        photoUrl: formData.photoUrl,
        classes: formData.classes,
        // Also set single class fields for backward compatibility
        assignedClass: formData.classes[0]?.assignedClass || '',
        classTime: formData.classes[0]?.classTime || '',
      };

      console.log('Submitting student data:', studentData);

      if (editingStudent) {
        await updateStudent(editingStudent.id, studentData);
      } else {
        await addStudent(studentData);
      }
      setIsModalOpen(false);
    } catch (error) {
      alert(error.message || 'Failed to save student');
    }
  };

  const handleAddClass = () => {
    setFormData({
      ...formData,
      classes: [...formData.classes, { assignedClass: '', classTime: '' }],
    });
  };

  const handleRemoveClass = (index) => {
    if (formData.classes.length > 1) {
      setFormData({
        ...formData,
        classes: formData.classes.filter((_, i) => i !== index),
      });
    }
  };

  const handleClassChange = (index, field, value) => {
    const updatedClasses = [...formData.classes];
    updatedClasses[index][field] = value;
    setFormData({ ...formData, classes: updatedClasses });
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
      } catch (error) {
        alert(error.message || 'Failed to delete student');
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-navy-900 dark:text-white">Student Management</h2>
        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="flex-1 sm:w-56 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-navy-800 text-sm text-gray-900 dark:text-white"
          />
          <Button onClick={() => handleOpenModal()}>
            <i className="fa-solid fa-plus mr-1" /> Add Student
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-navy-800/50">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Student</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">
                  Phone
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                  Qualification
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                  Status
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-navy-800/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={s.photoUrl} alt={s.name} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-navy-900 dark:text-white">{s.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 md:hidden">{s.phone}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 lg:hidden">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">{s.phone}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden lg:table-cell">{s.email}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{s.qualification}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex gap-2">
                      {s.isAdmitted && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Admitted</span>
                      )}
                      {s.isPaid && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Paid</span>
                      )}
                      {!s.isAdmitted && !s.isPaid && (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">Pending</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleOpenModal(s)}
                      className="text-blue-500 hover:text-blue-600 mr-3"
                      title="Edit"
                    >
                      <i className="fa-solid fa-pen-to-square" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-500 hover:text-red-600"
                      title="Delete"
                    >
                      <i className="fa-solid fa-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <i className="fa-solid fa-users text-3xl mb-2 opacity-30" />
            <p>No students found</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStudent ? 'Edit Student' : 'Add New Student'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Qualification" value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} required />
            <Input label="Age" type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} required />
          </div>
          <Input label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
          <Input label="Photo URL" value={formData.photoUrl} onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Classes</label>
            {formData.classes.map((classItem, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 mb-2 relative">
                <Input
                  label={index === 0 ? 'Assigned Class' : ''}
                  value={classItem.assignedClass}
                  onChange={(e) => handleClassChange(index, 'assignedClass', e.target.value)}
                  placeholder="e.g., Full Stack Web Development"
                />
                <div className="relative">
                  <Input
                    label={index === 0 ? 'Class Time' : ''}
                    value={classItem.classTime}
                    onChange={(e) => handleClassChange(index, 'classTime', e.target.value)}
                    placeholder="e.g., Mon-Fri 10AM-12PM"
                  />
                  {formData.classes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveClass(index)}
                      className="absolute right-8 top-7 text-red-500 hover:text-red-600"
                      title="Remove class"
                    >
                      <i className="fa-solid fa-minus" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddClass}
              className="mt-2 text-cta-500 hover:text-cta-600 text-sm font-medium flex items-center gap-1"
            >
              <i className="fa-solid fa-plus" /> Add another class
            </button>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingStudent ? 'Update' : 'Add'} Student
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeacherStudents;
