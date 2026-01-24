// Mock data store for development and testing
import {
  Student,
  Teacher,
  Admin,
  Course,
  Test,
  Question,
  Result,
  TestAttempt,
  Batch,
  Analytics,
  Notification,
} from "./types";

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock Students
export const mockStudents: Student[] = [
  {
    id: "S001",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    role: "student",
    avatar: "RS",
    phone: "+91 98765 43210",
    joinDate: "2024-06-15",
    batch: "JEE Main 2025 - Batch A",
    rollNumber: "JEE25-001",
    course: "JEE Main 2025",
    totalTests: 45,
    averageScore: 285,
    percentile: 99.2,
    rank: 1,
  },
  {
    id: "S002",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    role: "student",
    avatar: "PP",
    phone: "+91 98765 43211",
    joinDate: "2024-06-16",
    batch: "JEE Main 2025 - Batch A",
    rollNumber: "JEE25-002",
    course: "JEE Main 2025",
    totalTests: 43,
    averageScore: 280,
    percentile: 98.8,
    rank: 2,
  },
  {
    id: "S003",
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    role: "student",
    avatar: "AK",
    phone: "+91 98765 43212",
    joinDate: "2024-06-17",
    batch: "JEE Main 2025 - Batch B",
    rollNumber: "JEE25-003",
    course: "JEE Main 2025",
    totalTests: 44,
    averageScore: 278,
    percentile: 98.1,
    rank: 3,
  },
  {
    id: "S004",
    name: "Sneha Gupta",
    email: "sneha.gupta@example.com",
    role: "student",
    avatar: "SG",
    phone: "+91 98765 43213",
    joinDate: "2024-06-18",
    batch: "NEET 2025 - Batch A",
    rollNumber: "NEET25-001",
    course: "NEET 2025",
    totalTests: 42,
    averageScore: 275,
    percentile: 97.5,
    rank: 4,
  },
  {
    id: "S005",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    role: "student",
    avatar: "VS",
    phone: "+91 98765 43214",
    joinDate: "2024-06-19",
    batch: "JEE Advanced 2025 - Batch A",
    rollNumber: "JEEA25-001",
    course: "JEE Advanced 2025",
    totalTests: 40,
    averageScore: 272,
    percentile: 97.0,
    rank: 5,
  },
];

// Mock Teachers
export const mockTeachers: Teacher[] = [
  {
    id: "T001",
    name: "Dr. Rajesh Verma",
    email: "rajesh.verma@example.com",
    role: "teacher",
    avatar: "RV",
    phone: "+91 98765 43220",
    joinDate: "2020-01-15",
    subject: "Physics",
    experience: 15,
    testsCreated: 120,
    questionsCreated: 2500,
  },
  {
    id: "T002",
    name: "Prof. Meera Iyer",
    email: "meera.iyer@example.com",
    role: "teacher",
    avatar: "MI",
    phone: "+91 98765 43221",
    joinDate: "2019-06-10",
    subject: "Chemistry",
    experience: 18,
    testsCreated: 150,
    questionsCreated: 3200,
  },
  {
    id: "T003",
    name: "Mr. Sanjay Deshmukh",
    email: "sanjay.deshmukh@example.com",
    role: "teacher",
    avatar: "SD",
    phone: "+91 98765 43222",
    joinDate: "2021-03-20",
    subject: "Mathematics",
    experience: 12,
    testsCreated: 100,
    questionsCreated: 2000,
  },
  {
    id: "T004",
    name: "Dr. Anjali Reddy",
    email: "anjali.reddy@example.com",
    role: "teacher",
    avatar: "AR",
    phone: "+91 98765 43223",
    joinDate: "2020-08-05",
    subject: "Biology",
    experience: 14,
    testsCreated: 110,
    questionsCreated: 2300,
  },
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: "C001",
    name: "JEE Main 2025",
    description: "Complete JEE Main preparation with mock tests and study material",
    students: 1250,
    batches: 12,
    teachers: ["T001", "T002", "T003"],
    startDate: "2024-06-01",
    endDate: "2025-04-30",
    subjects: ["Physics", "Chemistry", "Mathematics"],
  },
  {
    id: "C002",
    name: "JEE Advanced 2025",
    description: "Advanced level JEE preparation for top tier engineering colleges",
    students: 680,
    batches: 8,
    teachers: ["T001", "T002", "T003"],
    startDate: "2024-06-01",
    endDate: "2025-05-31",
    subjects: ["Physics", "Chemistry", "Mathematics"],
  },
  {
    id: "C003",
    name: "NEET 2025",
    description: "Complete NEET preparation for medical entrance",
    students: 920,
    batches: 10,
    teachers: ["T001", "T002", "T004"],
    startDate: "2024-06-01",
    endDate: "2025-05-31",
    subjects: ["Physics", "Chemistry", "Biology"],
  },
  {
    id: "C004",
    name: "Foundation (Class 11)",
    description: "Foundation course for Class 11 students",
    students: 540,
    batches: 6,
    teachers: ["T001", "T002", "T003", "T004"],
    startDate: "2024-04-01",
    endDate: "2025-03-31",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
  },
];

// Mock Questions
export const mockQuestions: Question[] = [
  {
    id: "Q001",
    text: "A particle of mass 'm' is moving in a circular path of radius 'r' with uniform speed 'v'. What is the centripetal force acting on it?",
    type: "MCQ",
    subject: "Physics",
    topic: "Circular Motion",
    chapter: "Laws of Motion",
    difficulty: "Medium",
    marks: 4,
    negativeMarks: 1,
    options: ["mv²/r", "mvr", "mv/r", "mr/v"],
    correctAnswer: "mv²/r",
    solution: "The centripetal force is given by F = mv²/r, where m is mass, v is velocity, and r is radius.",
    createdBy: "T001",
    createdAt: "2024-01-10",
    status: "approved",
    tags: ["mechanics", "circular-motion"],
  },
  {
    id: "Q002",
    text: "What is the molecular formula of Benzene?",
    type: "MCQ",
    subject: "Chemistry",
    topic: "Organic Chemistry",
    chapter: "Hydrocarbons",
    difficulty: "Easy",
    marks: 4,
    negativeMarks: 1,
    options: ["C6H6", "C6H12", "C5H6", "C7H8"],
    correctAnswer: "C6H6",
    solution: "Benzene has the molecular formula C6H6, consisting of a hexagonal ring structure.",
    createdBy: "T002",
    createdAt: "2024-01-11",
    status: "approved",
    tags: ["organic-chemistry", "hydrocarbons"],
  },
  {
    id: "Q003",
    text: "Find the derivative of sin(x) with respect to x.",
    type: "MCQ",
    subject: "Mathematics",
    topic: "Differentiation",
    chapter: "Calculus",
    difficulty: "Easy",
    marks: 4,
    negativeMarks: 1,
    options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
    correctAnswer: "cos(x)",
    solution: "The derivative of sin(x) is cos(x). This is a standard differentiation formula.",
    createdBy: "T003",
    createdAt: "2024-01-12",
    status: "approved",
    tags: ["calculus", "differentiation"],
  },
];

// Mock Tests
export const mockTests: Test[] = [
  {
    id: "TEST001",
    name: "JEE Main Mock Test 15",
    description: "Full syllabus mock test covering Physics, Chemistry, and Mathematics",
    type: "Mock Test",
    course: "JEE Main 2025",
    duration: 180,
    totalMarks: 300,
    questions: ["Q001", "Q002", "Q003"],
    scheduledDate: "2026-01-25",
    startTime: "09:00",
    endTime: "12:00",
    status: "ongoing",
    createdBy: "T001",
    createdAt: "2026-01-20",
    instructions: "Read all instructions carefully before starting the test.",
    allowedStudents: ["all"],
    attemptedBy: ["S001", "S002", "S003"],
    passMarks: 100,
  },
  {
    id: "TEST002",
    name: "NEET Full Syllabus Test",
    description: "Complete NEET syllabus test",
    type: "Full Syllabus",
    course: "NEET 2025",
    duration: 180,
    totalMarks: 720,
    questions: ["Q001", "Q002", "Q003"],
    scheduledDate: "2026-01-23",
    startTime: "10:00",
    endTime: "13:00",
    status: "completed",
    createdBy: "T002",
    createdAt: "2026-01-18",
    instructions: "Answer all questions. Negative marking applicable.",
    allowedStudents: ["all"],
    attemptedBy: ["S004"],
    passMarks: 360,
  },
  {
    id: "TEST003",
    name: "Physics Chapter Test - Mechanics",
    description: "Chapter-wise test on Mechanics",
    type: "Chapter Test",
    course: "JEE Main 2025",
    subject: "Physics",
    duration: 90,
    totalMarks: 100,
    questions: ["Q001"],
    scheduledDate: "2026-01-28",
    startTime: "14:00",
    endTime: "15:30",
    status: "scheduled",
    createdBy: "T001",
    createdAt: "2026-01-22",
    instructions: "Focus on mechanics concepts",
    allowedStudents: ["all"],
    attemptedBy: [],
    passMarks: 40,
  },
];

// Mock Results
export const mockResults: Result[] = [
  {
    id: "R001",
    testId: "TEST001",
    studentId: "S001",
    score: 285,
    maxScore: 300,
    percentage: 95,
    rank: 1,
    percentile: 99.2,
    correctAnswers: 72,
    wrongAnswers: 3,
    unattempted: 0,
    timeSpent: 10200,
    submittedAt: "2026-01-25T12:00:00",
    subjectWise: [
      { subject: "Physics", score: 95, maxScore: 100, percentage: 95 },
      { subject: "Chemistry", score: 92, maxScore: 100, percentage: 92 },
      { subject: "Mathematics", score: 98, maxScore: 100, percentage: 98 },
    ],
    topicWise: [
      { topic: "Mechanics", score: 48, maxScore: 50, percentage: 96 },
      { topic: "Optics", score: 47, maxScore: 50, percentage: 94 },
      { topic: "Organic Chemistry", score: 92, maxScore: 100, percentage: 92 },
    ],
  },
];

// Mock Analytics
export const mockAnalytics: Analytics = {
  totalTests: 45,
  averageScore: 285,
  highestScore: 298,
  lowestScore: 220,
  averagePercentile: 99.2,
  strongTopics: ["Calculus", "Mechanics", "Organic Chemistry"],
  weakTopics: ["Electromagnetism", "Coordination Compounds"],
  improvementRate: 12.5,
  testsTrend: [
    { date: "2025-12-01", score: 250 },
    { date: "2025-12-15", score: 265 },
    { date: "2026-01-01", score: 275 },
    { date: "2026-01-15", score: 285 },
  ],
  subjectPerformance: [
    { subject: "Physics", averageScore: 92, tests: 15, trend: "up" },
    { subject: "Chemistry", averageScore: 88, tests: 15, trend: "stable" },
    { subject: "Mathematics", averageScore: 95, tests: 15, trend: "up" },
  ],
};

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: "N001",
    title: "New Test Scheduled",
    message: "JEE Main Mock Test 16 has been scheduled for tomorrow at 9:00 AM",
    type: "info",
    timestamp: "2026-01-24T10:30:00",
    read: false,
    userId: "S001",
    actionUrl: "/tests",
  },
  {
    id: "N002",
    title: "Result Published",
    message: "Your result for NEET Full Syllabus Test is now available",
    type: "success",
    timestamp: "2026-01-23T15:00:00",
    read: false,
    userId: "S004",
    actionUrl: "/analytics",
  },
];

// Mock Batches
export const mockBatches: Batch[] = [
  {
    id: "B001",
    name: "JEE Main 2025 - Batch A",
    course: "JEE Main 2025",
    students: ["S001", "S002"],
    teacher: "T001",
    schedule: "Mon, Wed, Fri - 9:00 AM to 12:00 PM",
    startDate: "2024-06-01",
  },
  {
    id: "B002",
    name: "JEE Main 2025 - Batch B",
    course: "JEE Main 2025",
    students: ["S003"],
    teacher: "T002",
    schedule: "Tue, Thu, Sat - 2:00 PM to 5:00 PM",
    startDate: "2024-06-01",
  },
];

// Helper functions for data management
export const getStudentById = (id: string) => mockStudents.find(s => s.id === id);
export const getTeacherById = (id: string) => mockTeachers.find(t => t.id === id);
export const getCourseById = (id: string) => mockCourses.find(c => c.id === id);
export const getTestById = (id: string) => mockTests.find(t => t.id === id);
export const getQuestionById = (id: string) => mockQuestions.find(q => q.id === id);
export const getResultById = (id: string) => mockResults.find(r => r.id === id);
export const getBatchById = (id: string) => mockBatches.find(b => b.id === id);

export const getStudentsByBatch = (batchId: string) => {
  const batch = getBatchById(batchId);
  return batch ? mockStudents.filter(s => batch.students.includes(s.id)) : [];
};

export const getTestsByCourse = (courseId: string) => 
  mockTests.filter(t => t.course === courseId);

export const getResultsByStudent = (studentId: string) =>
  mockResults.filter(r => r.studentId === studentId);

export const getTestsByTeacher = (teacherId: string) =>
  mockTests.filter(t => t.createdBy === teacherId);

export const getQuestionsByTeacher = (teacherId: string) =>
  mockQuestions.filter(q => q.createdBy === teacherId);
