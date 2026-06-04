import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [tests, setTests] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [session, setSession] = useState(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    const loadedFees = JSON.parse(localStorage.getItem('fees') || '[]');
    const loadedAttendance = JSON.parse(localStorage.getItem('attendance') || '[]');
    const loadedTests = JSON.parse(localStorage.getItem('tests') || '[]');
    const loadedTestResults = JSON.parse(localStorage.getItem('testResults') || '[]');
    const loadedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    const loadedSession = JSON.parse(localStorage.getItem('session') || 'null');

    // Initialize default data if empty
    if (loadedCourses.length === 0) {
      const defaultCourses = [
        { id: 'cr1', title: 'Full Stack Web Development', cat: 'Technology', duration: '6 Months', price: '25,000', img: 'https://placehold.co/600x400/0f172a/3b82f6?text=Web+Dev' },
        { id: 'cr2', title: 'Data Science & Analytics', cat: 'Technology', duration: '4 Months', price: '20,000', img: 'https://placehold.co/600x400/0f172a/fb923c?text=Data+Sci' },
        { id: 'cr3', title: 'Digital Marketing Mastery', cat: 'Business', duration: '3 Months', price: '15,000', img: 'https://placehold.co/600x400/0f172a/3b82f6?text=Marketing' },
        { id: 'cr4', title: 'Business Analytics & MBA Prep', cat: 'Business', duration: '5 Months', price: '30,000', img: 'https://placehold.co/600x400/0f172a/fb923c?text=MBA+Prep' },
        { id: 'cr5', title: 'UI/UX Design Certificate', cat: 'Design', duration: '4 Months', price: '18,000', img: 'https://placehold.co/600x400/0f172a/3b82f6?text=UI+UX' },
        { id: 'cr6', title: 'English Communication & IELTS', cat: 'Language', duration: '2 Months', price: '10,000', img: 'https://placehold.co/600x400/0f172a/fb923c?text=IELTS' },
      ];
      localStorage.setItem('courses', JSON.stringify(defaultCourses));
      setCourses(defaultCourses);
    } else {
      setCourses(loadedCourses);
    }

    if (loadedStudents.length === 0) {
      const defaultStudents = [
        { id: 's1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', qualification: 'B.Tech Computer Science', age: 22, address: '123, MG Road, Mumbai', photoUrl: 'https://placehold.co/100x100/0f172a/3b82f6?text=RS', assignedClass: 'Full Stack Web Development', classTime: 'Mon-Wed-Fri 10:00 AM - 1:00 PM', createdAt: new Date().toISOString() },
        { id: 's2', name: 'Priya Patel', email: 'priya@example.com', phone: '+91 98765 43211', qualification: 'B.Sc Mathematics', age: 21, address: '456, FC Road, Pune', photoUrl: 'https://placehold.co/100x100/0f172a/fb923c?text=PP', assignedClass: 'Data Science & Analytics', classTime: 'Tue-Thu-Sat 2:00 PM - 5:00 PM', createdAt: new Date().toISOString() },
        { id: 's3', name: 'Amit Kumar', email: 'amit@example.com', phone: '+91 98765 43212', qualification: 'B.Com', age: 23, address: '789, JM Road, Mumbai', photoUrl: 'https://placehold.co/100x100/0f172a/3b82f6?text=AK', assignedClass: 'Business Analytics & MBA Prep', classTime: 'Mon-Wed-Fri 3:00 PM - 6:00 PM', createdAt: new Date().toISOString() },
      ];
      localStorage.setItem('students', JSON.stringify(defaultStudents));
      setStudents(defaultStudents);
    } else {
      setStudents(loadedStudents);
    }

    if (loadedTests.length === 0) {
      const defaultTests = [
        {
          id: 't1',
          title: 'JavaScript Fundamentals',
          timeLimit: 15,
          questions: [
            { question: 'What is the output of typeof null?', options: ['null', 'undefined', 'object', 'number'], correctAnswer: 2 },
            { question: 'Which method adds an element to the end of an array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], correctAnswer: 0 },
            { question: 'What does === check?', options: ['Value only', 'Type only', 'Value and type', 'Neither'], correctAnswer: 2 },
            { question: 'Which is not a JavaScript data type?', options: ['String', 'Boolean', 'Float', 'Symbol'], correctAnswer: 2 },
            { question: 'What is the correct way to create a function?', options: ['function myFunc() {}', 'create myFunc() {}', 'def myFunc() {}', 'function:myFunc() {}'], correctAnswer: 0 },
          ],
        },
        {
          id: 't2',
          title: 'React Basics',
          timeLimit: 10,
          questions: [
            { question: 'What hook is used for state management?', options: ['useEffect', 'useState', 'useContext', 'useReducer'], correctAnswer: 1 },
            { question: 'What does JSX stand for?', options: ['JavaScript XML', 'Java Syntax Extension', 'JavaScript Extension', 'None'], correctAnswer: 0 },
            { question: 'Which is the correct way to pass props?', options: ['<Comp prop=value />', '<Comp {prop} />', '<Comp prop="value" />', 'Both A and C'], correctAnswer: 3 },
          ],
        },
      ];
      localStorage.setItem('tests', JSON.stringify(defaultTests));
      setTests(defaultTests);
    } else {
      setTests(loadedTests);
    }

    setFees(loadedFees);
    setAttendance(loadedAttendance);
    setTestResults(loadedTestResults);
    setSession(loadedSession);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('fees', JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem('attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('tests', JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem('testResults', JSON.stringify(testResults));
  }, [testResults]);

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('session', JSON.stringify(session));
  }, [session]);

  const addStudent = (student) => {
    const newStudent = { ...student, id: 's' + Date.now(), createdAt: new Date().toISOString() };
    setStudents([...students, newStudent]);
    return newStudent;
  };

  const updateStudent = (id, updates) => {
    setStudents(students.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const addFee = (fee) => {
    const newFee = { ...fee, id: 'f' + Date.now(), createdAt: new Date().toISOString() };
    setFees([...fees, newFee]);
    return newFee;
  };

  const updateFee = (id, updates) => {
    setFees(fees.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteFee = (id) => {
    setFees(fees.filter(f => f.id !== id));
  };

  const addAttendance = (record) => {
    const existingIndex = attendance.findIndex(
      a => a.studentId === record.studentId && a.date === record.date
    );
    if (existingIndex >= 0) {
      setAttendance(attendance.map((a, i) => i === existingIndex ? record : a));
    } else {
      setAttendance([...attendance, { ...record, id: 'a' + Date.now() }]);
    }
  };

  const addTest = (test) => {
    const newTest = { ...test, id: 't' + Date.now(), createdAt: new Date().toISOString() };
    setTests([...tests, newTest]);
    return newTest;
  };

  const updateTest = (id, updates) => {
    setTests(tests.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTest = (id) => {
    setTests(tests.filter(t => t.id !== id));
    setTestResults(testResults.filter(r => r.testId !== id));
  };

  const addTestResult = (result) => {
    const newResult = { ...result, id: 'tr' + Date.now(), completedAt: new Date().toISOString() };
    setTestResults([...testResults, newResult]);
    return newResult;
  };

  const addCourse = (course) => {
    const newCourse = { ...course, id: 'cr' + Date.now(), createdAt: new Date().toISOString() };
    setCourses([...courses, newCourse]);
    return newCourse;
  };

  const updateCourse = (id, updates) => {
    setCourses(courses.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const login = (role, username) => {
    const newSession = { role, username, studentId: role === 'student' ? 's1' : null };
    setSession(newSession);
    return newSession;
  };

  const logout = () => {
    setSession(null);
  };

  const value = {
    students,
    fees,
    attendance,
    tests,
    testResults,
    courses,
    session,
    addStudent,
    updateStudent,
    deleteStudent,
    addFee,
    updateFee,
    deleteFee,
    addAttendance,
    addTest,
    updateTest,
    deleteTest,
    addTestResult,
    addCourse,
    updateCourse,
    deleteCourse,
    login,
    logout,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
