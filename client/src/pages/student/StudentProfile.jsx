import React from 'react';

const StudentProfile = ({ student }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">My Profile</h2>
      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden max-w-2xl">
        <div className="h-24 bg-gradient-to-r from-cta-500 to-cta-600" />
        <div className="px-6 pb-6 -mt-12">
          <img
            src={student.photoUrl}
            alt={student.name}
            className="w-24 h-24 rounded-2xl border-4 border-white dark:border-navy-900 object-cover shadow-lg"
          />
          <h3 className="text-xl font-bold text-navy-900 dark:text-white mt-3">{student.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{student.qualification}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-navy-800 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-phone text-sm text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-sm font-medium text-navy-900 dark:text-white">{student.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-navy-800 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-envelope text-sm text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-sm font-medium text-navy-900 dark:text-white">{student.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-navy-800 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-cake-candles text-sm text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Age</p>
                <p className="text-sm font-medium text-navy-900 dark:text-white">{student.age} years</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-navy-800 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-calendar text-sm text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Enrolled Since</p>
                <p className="text-sm font-medium text-navy-900 dark:text-white">
                  {new Date(student.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-start gap-3">
            <div className="w-9 h-9 bg-gray-100 dark:bg-navy-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-location-dot text-sm text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
              <p className="text-sm font-medium text-navy-900 dark:text-white">{student.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
