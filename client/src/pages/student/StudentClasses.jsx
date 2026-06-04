import React from 'react';

const StudentClasses = ({ student }) => {
  const classes = student.classes || [];
  const hasMultipleClasses = classes.length > 0;
  const hasSingleClass = student.assignedClass || student.classTime;

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">My Classes</h2>
      
      {hasMultipleClasses ? (
        <div className="space-y-4 max-w-2xl">
          {classes.map((classItem, index) => (
            <div key={index} className="bg-white dark:bg-navy-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-cta-500 to-cta-600" />
              <div className="p-6">
                <h4 className="font-bold text-navy-900 dark:text-white mb-2 text-lg">
                  {classItem.assignedClass || 'Class Not Specified'}
                </h4>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium">
                  <i className="fa-regular fa-clock w-5 text-center text-cta-500" />
                  {classItem.classTime || 'Schedule Pending'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : hasSingleClass ? (
        <div className="bg-white dark:bg-navy-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mb-6 max-w-2xl">
          <div className="h-2 bg-gradient-to-r from-cta-500 to-cta-600" />
          <div className="p-6">
            <h4 className="font-bold text-navy-900 dark:text-white mb-2 text-lg">
              My Enrolled Class: {student.assignedClass || 'Not Specified'}
            </h4>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-medium">
              <i className="fa-regular fa-clock w-5 text-center text-cta-500" />
              {student.classTime || 'Schedule Pending'}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <i className="fa-solid fa-chalkboard-user text-4xl mb-3 opacity-30" />
          <p>No class assigned yet</p>
        </div>
      )}
    </div>
  );
};

export default StudentClasses;
