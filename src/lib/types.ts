// Shared TypeScript interfaces and types for the exam management system

export type UserRole = "admin" | "teacher" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  joinDate: string;
}

export interface Student extends User {
  role: "student";
  batch: string;
  rollNumber: string;
  course: string;
  totalTests: number;
  averageScore: number;
  percentile: number;
  rank?: number;
}

export interface Teacher extends User {
  role: "teacher";
  subject: string;
  experience: number;
  testsCreated: number;
  questionsCreated: number;
}

export interface Admin extends User {
  role: "admin";
  institute: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  students: number;
  batches: number;
  teachers: string[];
  startDate: string;
  endDate: string;
  subjects: string[];
}

export interface Batch {
  id: string;
  name: string;
  course: string;
  students: string[];
  teacher: string;
  schedule: string;
  startDate: string;
}

export type QuestionType = "MCQ" | "Numerical" | "Multiple Correct" | "Integer" | "Subjective";
export type DifficultyLevel = "Easy" | "Medium" | "Hard";
export type QuestionStatus = "approved" | "pending" | "rejected";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  subject: string;
  topic: string;
  chapter: string;
  difficulty: DifficultyLevel;
  marks: number;
  negativeMarks?: number;
  options?: string[];
  correctAnswer: string | number | string[];
  solution?: string;
  createdBy: string;
  createdAt: string;
  status: QuestionStatus;
  tags?: string[];
}

export type TestStatus = "draft" | "scheduled" | "ongoing" | "completed" | "cancelled";
export type TestType = "Mock Test" | "Chapter Test" | "Full Syllabus" | "Practice Test";

export interface Test {
  id: string;
  name: string;
  description: string;
  type: TestType;
  course: string;
  subject?: string;
  duration: number; // in minutes
  totalMarks: number;
  questions: string[]; // question IDs
  scheduledDate: string;
  startTime: string;
  endTime?: string;
  status: TestStatus;
  createdBy: string;
  createdAt: string;
  instructions?: string;
  allowedStudents: string[]; // student IDs or "all"
  attemptedBy: string[];
  passMarks?: number;
}

export interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  startedAt: string;
  submittedAt?: string;
  score?: number;
  maxScore: number;
  percentage?: number;
  rank?: number;
  percentile?: number;
  answers: {
    questionId: string;
    answer: string | number | string[];
    isCorrect?: boolean;
    marksObtained?: number;
    timeSpent?: number;
  }[];
  timeSpent: number; // in seconds
  status: "in-progress" | "submitted" | "evaluated";
}

export interface Result {
  id: string;
  testId: string;
  studentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  rank: number;
  percentile: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattempted: number;
  timeSpent: number;
  submittedAt: string;
  subjectWise: {
    subject: string;
    score: number;
    maxScore: number;
    percentage: number;
  }[];
  topicWise: {
    topic: string;
    score: number;
    maxScore: number;
    percentage: number;
  }[];
}

export interface Analytics {
  totalTests: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  averagePercentile: number;
  strongTopics: string[];
  weakTopics: string[];
  improvementRate: number;
  testsTrend: {
    date: string;
    score: number;
  }[];
  subjectPerformance: {
    subject: string;
    averageScore: number;
    tests: number;
    trend: "up" | "down" | "stable";
  }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
  read: boolean;
  userId: string;
  actionUrl?: string;
}

export interface DashboardStats {
  totalStudents?: number;
  totalTeachers?: number;
  totalTests?: number;
  totalCourses?: number;
  activeStudents?: number;
  upcomingTests?: number;
  recentActivity?: string[];
  growthRate?: {
    students: number;
    tests: number;
    performance: number;
  };
}
