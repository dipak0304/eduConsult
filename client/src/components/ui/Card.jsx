import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-navy-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
