import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import Modal from '../../components/ui/Modal';
import html2canvas from 'html2canvas';

const TeacherAdmitted = () => {
  const { students, fees, attendance } = useData();
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState('details'); // 'details' or 'bill'
  const billRef = useRef(null);

  const admittedStudents = students.filter((s) => s.isAdmitted);

  const filtered = admittedStudents.filter(
    (s) => {
      const name = (s.name || s.fullName || '').toLowerCase();
      const email = (s.email || '').toLowerCase();
      const phone = s.phone || '';
      const searchLower = search.toLowerCase();
      return name.includes(searchLower) ||
             email.includes(searchLower) ||
             phone.includes(searchLower);
    }
  );

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const studentFees = selectedStudent ? fees.filter(f => f.studentId === selectedStudent.id) : [];
  const totalAmount = studentFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
  const studentAttendance = selectedStudent ? attendance.filter(a => a.studentId === selectedStudent.id) : [];

  const handleDownload = async () => {
    if (billRef.current) {
      const canvas = await html2canvas(billRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `${selectedStudent?.name}_fee_bill.jpg`;
      link.href = canvas.toDataURL('image/jpeg');
      link.click();
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-navy-900 dark:text-white">Admitted Students</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search admitted students..."
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-navy-800 text-sm text-gray-900 dark:text-white w-48"
        />
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
                  Enrolled Class
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => handleStudentClick(s)}
                  className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-navy-800/30 transition-colors cursor-pointer"
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
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{s.assignedClass || 'N/A'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      {s.isAdmitted && (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                          Admitted
                        </span>
                      )}
                      {s.isPaid && (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                          Paid
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <i className="fa-solid fa-user-check text-3xl mb-2 opacity-30" />
            <p>No admitted students found</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalView === 'details' ? `${selectedStudent?.name}'s Details` : `${selectedStudent?.name}'s Fees`} extraButton={modalView === 'bill' && <button onClick={handleDownload} className="px-4 py-2 bg-cta-500 text-white rounded-lg hover:bg-cta-600 transition-colors flex items-center gap-2">
        <i className="fa-solid fa-download" /> Download as JPG
      </button>}>
        {modalView === 'details' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <img src={selectedStudent?.photoUrl} alt={selectedStudent?.name} className="w-20 h-20 rounded-full object-cover" />
              <div>
                <h3 className="text-xl font-bold text-navy-900 dark:text-white">{selectedStudent?.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedStudent?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-navy-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                <p className="font-medium text-navy-900 dark:text-white">{selectedStudent?.phone || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-navy-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Qualification</p>
                <p className="font-medium text-navy-900 dark:text-white">{selectedStudent?.qualification || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-navy-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Age</p>
                <p className="font-medium text-navy-900 dark:text-white">{selectedStudent?.age || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-navy-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Address</p>
                <p className="font-medium text-navy-900 dark:text-white break-words">{selectedStudent?.address || 'N/A'}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-navy-900 dark:text-white mb-3">Enrolled Classes</h4>
              {selectedStudent?.classes && selectedStudent.classes.length > 0 ? (
                <div className="space-y-2">
                  {selectedStudent.classes.map((classItem, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-navy-800 rounded-lg">
                      <p className="font-medium text-navy-900 dark:text-white">{classItem.assignedClass || 'Class Not Specified'}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{classItem.classTime || 'Schedule Pending'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No classes assigned</p>
              )}
            </div>

            <div>
              <h4 className="font-bold text-navy-900 dark:text-white mb-3">Attendance Summary</h4>
              {studentAttendance.length > 0 ? (
                <div className="p-4 bg-gray-50 dark:bg-navy-800 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{studentAttendance.filter(a => a.status === 'present').length}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">{studentAttendance.filter(a => a.status === 'absent').length}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-600">{studentAttendance.length}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No attendance records</p>
              )}
            </div>

            <button
              onClick={() => setModalView('bill')}
              className="w-full px-4 py-3 bg-cta-500 text-white rounded-lg hover:bg-cta-600 transition-colors flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-file-invoice-dollar" /> View Fee Bill
            </button>
          </div>
        ) : (
          studentFees.length > 0 ? (
            <div className="space-y-3">
            <div ref={billRef} className="bg-white p-6 rounded-lg border-2 border-gray-200">
              {/* Consultancy Header */}
              <div className="text-center mb-6 pb-4 border-b-2 border-cta-500">
                <h1 className="text-2xl font-bold text-navy-900 mb-1">deepu consultancy</h1>
                <p className="text-sm text-gray-600">Kathmandu, Nepal</p>
                <p className="text-sm text-gray-600">info@consultancy.com</p>
              </div>

              {/* Bill Title */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-navy-900">FEE RECEIPT</h2>
                <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
              </div>

              {/* Student Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-navy-900 mb-2">Student Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedStudent?.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedStudent?.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedStudent?.phone}</p>
                  <p><span className="font-medium">Class:</span> {selectedStudent?.assignedClass || 'N/A'}</p>
                </div>
              </div>

              {/* Fee Details */}
              <div className="mb-6">
                <h3 className="font-bold text-navy-900 mb-3">Fee Details</h3>
                {studentFees.map((fee) => (
                  <div key={fee.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-navy-900">{fee.description}</p>
                      <p className="text-xs text-gray-500">Due: {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-navy-900">Rs. {fee.amount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        fee.status === 'paid' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 mt-4">
                <p className="text-lg font-bold text-navy-900">Total Amount</p>
                <p className="text-2xl font-bold text-cta-600">Rs. {totalAmount}</p>
              </div>

              {/* Stamp */}
              <div className="mt-6 flex justify-center">
                <div className="border-2 border-cta-500 rounded-lg p-3 transform -rotate-12 opacity-80">
                  <p className="text-center font-bold text-cta-600 text-sm">PAID</p>
                  <p className="text-center text-xs text-gray-600">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
                <p>Thank you for your payment!</p>
                <p>For queries, contact: info@consultancy.com</p>
              </div>
            </div>
          </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <i className="fa-solid fa-receipt text-3xl mb-2 opacity-30" />
              <p>No fees found for this student</p>
            </div>
          )
        )}
        {modalView === 'bill' && (
          <button
            onClick={() => setModalView('details')}
            className="w-full mt-4 px-4 py-3 bg-gray-200 dark:bg-navy-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-navy-700 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-arrow-left" /> Back to Details
          </button>
        )}
      </Modal>
    </div>
  );
};

export default TeacherAdmitted;
