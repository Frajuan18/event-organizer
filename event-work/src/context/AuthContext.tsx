// context/AuthContext.tsx - UPDATED
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: 'attendee' | 'organizer';
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, name: string, role: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Create profile from Firebase user
  const createProfileFromUser = (firebaseUser: User, role: 'attendee' | 'organizer' = 'attendee'): UserProfile => {
    return {
      id: firebaseUser.uid,
      userId: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      role: role,
      created_at: new Date().toISOString()
    };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email);
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Try to get role from localStorage or use default
        const savedRole = localStorage.getItem(`user_role_${firebaseUser.uid}`);
        const role = (savedRole as 'attendee' | 'organizer') || 'attendee';
        
        const profile = createProfileFromUser(firebaseUser, role);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, name: string, role: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting sign up process...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Firebase user created:', userCredential.user.uid);
      
      // Store role in localStorage
      localStorage.setItem(`user_role_${userCredential.user.uid}`, role);
      
      // Create profile
      const profile: UserProfile = {
        id: userCredential.user.uid,
        userId: userCredential.user.uid,
        email,
        name,
        role: role as 'attendee' | 'organizer',
        created_at: new Date().toISOString()
      };
      
      setUserProfile(profile);
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Error signing up:', error);
      const errorMessage = error.message || 'Failed to sign up';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get role from localStorage
      const savedRole = localStorage.getItem(`user_role_${userCredential.user.uid}`);
      const role = savedRole as 'attendee' | 'organizer' || 'attendee';
      
      const profile = createProfileFromUser(userCredential.user, role);
      setUserProfile(profile);
      
      toast.success('Logged in successfully');
    } catch (error: any) {
      console.error('Error signing in:', error);
      const errorMessage = error.message || 'Failed to sign in';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Default role for Google sign-in
      const role = 'attendee';
      localStorage.setItem(`user_role_${userCredential.user.uid}`, role);
      
      const profile = createProfileFromUser(userCredential.user, role as 'attendee');
      setUserProfile(profile);
      
      toast.success('Logged in with Google successfully');
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      const errorMessage = error.message || 'Failed to sign in with Google';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Error signing out:', error);
      const errorMessage = error.message || 'Failed to sign out';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}