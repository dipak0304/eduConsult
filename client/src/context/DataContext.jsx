import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

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

  // Load data from localStorage on mount (for non-student data)
  useEffect(() => {
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

    setTestResults(loadedTestResults);
    setSession(loadedSession);
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      if (response.ok) {
        const data = await response.json();
        // Map server response (fullName) to client format (name)
        const mappedStudents = data.map(student => ({
          ...student,
          name: student.fullName,
          id: student._id,
        }));
        setStudents(mappedStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance`);
      if (response.ok) {
        const data = await response.json();
        // Map server response to client format
        const mappedAttendance = data.map(att => ({
          ...att,
          id: att._id,
        }));
        setAttendance(mappedAttendance);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchFees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/fees`);
      if (response.ok) {
        const data = await response.json();
        // Map server response to client format
        const mappedFees = data.map(fee => ({
          ...fee,
          id: fee._id,
        }));
        setFees(mappedFees);
      }
    } catch (error) {
      console.error('Error fetching fees:', error);
    }
  };

  // Fetch students from API on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch attendance from API on mount
  useEffect(() => {
    fetchAttendance();
  }, []);

  // Fetch fees from API on mount
  useEffect(() => {
    fetchFees();
  }, []);

  // Save data to localStorage whenever it changes (for non-student data)
  useEffect(() => {
    localStorage.setItem('testResults', JSON.stringify(testResults));
  }, [testResults]);

  useEffect(() => {
    localStorage.setItem('tests', JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('session', JSON.stringify(session));
  }, [session]);

  const addStudent = async (student) => {
    try {
      // Map client format (name) to server format (fullName)
      const serverStudent = {
        fullName: student.name,
        email: student.email,
        phone: student.phone,
        age: parseInt(student.age),
        qualification: student.qualification,
        address: student.address,
        photoUrl: student.photoUrl,
        assignedClass: student.assignedClass,
        classTime: student.classTime,
      };

      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serverStudent),
      });

      if (response.ok) {
        const data = await response.json();
        // Map server response back to client format
        const newStudent = {
          ...data,
          name: data.fullName,
          id: data._id,
        };
        setStudents([...students, newStudent]);
        return newStudent;
      } else {
        const error = await response.json();
        console.error('Error adding student:', error);
        throw new Error(error.message || 'Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  };

  const updateStudent = async (id, updates) => {
    try {
      // Map client format (name) to server format (fullName)
      const serverUpdates = {
        ...(updates.name && { fullName: updates.name }),
        ...(updates.email && { email: updates.email }),
        ...(updates.phone && { phone: updates.phone }),
        ...(updates.age !== undefined && { age: parseInt(updates.age) }),
        ...(updates.qualification && { qualification: updates.qualification }),
        ...(updates.address && { address: updates.address }),
        ...(updates.photoUrl && { photoUrl: updates.photoUrl }),
        ...(updates.assignedClass !== undefined && { assignedClass: updates.assignedClass }),
        ...(updates.classTime !== undefined && { classTime: updates.classTime }),
      };

      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serverUpdates),
      });

      if (response.ok) {
        const data = await response.json();
        // Map server response back to client format
        const updatedStudent = {
          ...data,
          name: data.fullName,
          id: data._id,
        };
        setStudents(students.map(s => s.id === id ? updatedStudent : s));
        return updatedStudent;
      } else {
        const error = await response.json();
        console.error('Error updating student:', error);
        throw new Error(error.message || 'Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  };

  const deleteStudent = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setStudents(students.filter(s => s.id !== id));
      } else {
        const error = await response.json();
        console.error('Error deleting student:', error);
        throw new Error(error.message || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  };

  const addFee = async (fee) => {
    try {
      const student = students.find(s => s.id === fee.studentId);
      const response = await fetch(`${API_BASE_URL}/fees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...fee,
          studentName: student ? student.name : 'Unknown',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newFee = {
          ...data,
          id: data._id,
        };
        setFees([...fees, newFee]);
        return newFee;
      } else {
        const error = await response.json();
        console.error('Error adding fee:', error);
        throw new Error(error.message || 'Failed to add fee');
      }
    } catch (error) {
      console.error('Error adding fee:', error);
      throw error;
    }
  };

  const updateFee = async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/fees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedFee = {
          ...data,
          id: data._id,
        };
        setFees(fees.map(f => f.id === id ? updatedFee : f));
        return updatedFee;
      } else {
        const error = await response.json();
        console.error('Error updating fee:', error);
        throw new Error(error.message || 'Failed to update fee');
      }
    } catch (error) {
      console.error('Error updating fee:', error);
      throw error;
    }
  };

  const deleteFee = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/fees/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFees(fees.filter(f => f.id !== id));
      } else {
        const error = await response.json();
        console.error('Error deleting fee:', error);
        throw new Error(error.message || 'Failed to delete fee');
      }
    } catch (error) {
      console.error('Error deleting fee:', error);
      throw error;
    }
  };

  const addAttendance = async (record) => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });

      if (response.ok) {
        const data = await response.json();
        // Map server response to client format
        const newAttendance = {
          ...data,
          id: data._id,
        };
        
        // Check if record already exists and update, otherwise add
        const existingIndex = attendance.findIndex(
          a => a.studentId === record.studentId && a.date === record.date
        );
        if (existingIndex >= 0) {
          setAttendance(attendance.map((a, i) => i === existingIndex ? newAttendance : a));
        } else {
          setAttendance([...attendance, newAttendance]);
        }
        return newAttendance;
      } else {
        const error = await response.json();
        console.error('Error adding attendance:', error);
        throw new Error(error.message || 'Failed to add attendance');
      }
    } catch (error) {
      console.error('Error adding attendance:', error);
      throw error;
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
