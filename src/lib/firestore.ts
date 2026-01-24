import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';

// Generic CRUD operations

export const createDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: any
) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
    return { id: docId, ...data };
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

export const getDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

export const getDocuments = async (
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

// Specific collection operations

// Tests
export const createTest = (data: any) => createDocument('tests', data);
export const updateTest = (id: string, data: any) => updateDocument('tests', id, data);
export const deleteTest = (id: string) => deleteDocument('tests', id);
export const getTest = (id: string) => getDocument('tests', id);
export const getTests = (constraints: QueryConstraint[] = []) => 
  getDocuments('tests', constraints);

// Students
export const createStudent = (data: any) => createDocument('students', data);
export const updateStudent = (id: string, data: any) => updateDocument('students', id, data);
export const deleteStudent = (id: string) => deleteDocument('students', id);
export const getStudent = (id: string) => getDocument('students', id);
export const getStudents = (constraints: QueryConstraint[] = []) => 
  getDocuments('students', constraints);

// Teachers
export const createTeacher = (data: any) => createDocument('teachers', data);
export const updateTeacher = (id: string, data: any) => updateDocument('teachers', id, data);
export const deleteTeacher = (id: string) => deleteDocument('teachers', id);
export const getTeacher = (id: string) => getDocument('teachers', id);
export const getTeachers = (constraints: QueryConstraint[] = []) => 
  getDocuments('teachers', constraints);

// Courses
export const createCourse = (data: any) => createDocument('courses', data);
export const updateCourse = (id: string, data: any) => updateDocument('courses', id, data);
export const deleteCourse = (id: string) => deleteDocument('courses', id);
export const getCourse = (id: string) => getDocument('courses', id);
export const getCourses = (constraints: QueryConstraint[] = []) => 
  getDocuments('courses', constraints);

// Batches
export const createBatch = (data: any) => createDocument('batches', data);
export const updateBatch = (id: string, data: any) => updateDocument('batches', id, data);
export const deleteBatch = (id: string) => deleteDocument('batches', id);
export const getBatch = (id: string) => getDocument('batches', id);
export const getBatches = (constraints: QueryConstraint[] = []) => 
  getDocuments('batches', constraints);

// Questions
export const createQuestion = (data: any) => createDocument('questions', data);
export const updateQuestion = (id: string, data: any) => updateDocument('questions', id, data);
export const deleteQuestion = (id: string) => deleteDocument('questions', id);
export const getQuestion = (id: string) => getDocument('questions', id);
export const getQuestions = (constraints: QueryConstraint[] = []) => 
  getDocuments('questions', constraints);

// Submissions
export const createSubmission = (data: any) => createDocument('submissions', data);
export const updateSubmission = (id: string, data: any) => updateDocument('submissions', id, data);
export const deleteSubmission = (id: string) => deleteDocument('submissions', id);
export const getSubmission = (id: string) => getDocument('submissions', id);
export const getSubmissions = (constraints: QueryConstraint[] = []) => 
  getDocuments('submissions', constraints);

// Notifications
export const createNotification = (data: any) => createDocument('notifications', data);
export const updateNotification = (id: string, data: any) => updateDocument('notifications', id, data);
export const deleteNotification = (id: string) => deleteDocument('notifications', id);
export const getNotification = (id: string) => getDocument('notifications', id);
export const getNotifications = (constraints: QueryConstraint[] = []) => 
  getDocuments('notifications', constraints);
