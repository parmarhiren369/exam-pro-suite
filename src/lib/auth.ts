import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
  avatar?: string;
  phone?: string;
  createdAt: string;
}

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'teacher' | 'student'
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile
    await updateProfile(user, { displayName: name });

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      name,
      role,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    return { user, profile: userProfile };
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(error.message);
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const profile = userDoc.exists() ? (userDoc.data() as UserProfile) : null;

    return { user, profile };
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message);
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message);
  }
};

// Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  try {
    await setDoc(doc(db, 'users', uid), data, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Auth state observer
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
