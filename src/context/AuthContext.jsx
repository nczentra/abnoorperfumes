import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  isFirebaseConfigured 
} from '../firebase/config';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  signInWithPopup, 
  sendPasswordResetEmail,
  updateProfile as fbUpdateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { emailService } from '../services/emailService';

export const ADMIN_EMAILS = [
  'abnoorperfumes@gmail.com',
  'admin@abnoorperfumes.com',
  'concierge@abnoorperfumes.com',
  'fasilyousf687@gmail.com',
];

export const checkIsAdmin = (email) => {
  if (!email) return false;
  const lower = email.trim().toLowerCase();
  return ADMIN_EMAILS.some(a => a.toLowerCase() === lower) || lower.includes('admin');
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const LOCAL_USER_KEY = 'ab_noor_auth_user';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state
  useEffect(() => {
    if (isFirebaseConfigured() && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user);
          // Fetch customer profile from Firestore
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const shouldBeAdmin = checkIsAdmin(user.email);
            if (userDoc.exists()) {
              const data = userDoc.data();
              if (shouldBeAdmin && data.role !== 'super_admin') {
                await updateDoc(doc(db, 'users', user.uid), { role: 'super_admin' });
                data.role = 'super_admin';
              }
              setUserProfile(data);
            } else {
              // Create default profile
              const defaultProfile = {
                uid: user.uid,
                fullName: user.displayName || (shouldBeAdmin ? 'Master Perfumer (Admin)' : 'Royal Patron'),
                email: user.email,
                phone: user.phoneNumber || '',
                role: shouldBeAdmin ? 'super_admin' : 'customer',
                addresses: [],
                createdAt: new Date().toISOString(),
              };
              await setDoc(doc(db, 'users', user.uid), defaultProfile);
              setUserProfile(defaultProfile);
            }
          } catch (e) {
            console.warn('Failed to load user profile from Firestore:', e);
          }
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Local fallback mode for offline / preview
      try {
        const saved = localStorage.getItem(LOCAL_USER_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setCurrentUser(parsed);
          setUserProfile(parsed);
        }
      } catch (e) {
        console.warn('Error reading local auth:', e);
      }
      setLoading(false);
    }
  }, []);

  // Save local fallback state
  const saveLocalUser = (user) => {
    setCurrentUser(user);
    setUserProfile(user);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  };

  // Register with Email and Password
  const register = async ({ fullName, email, password, phone }) => {
    const isOwnerOrAdmin = checkIsAdmin(email);
    if (isFirebaseConfigured() && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await fbUpdateProfile(cred.user, { displayName: fullName });
      
      const newProfile = {
        uid: cred.user.uid,
        fullName,
        email,
        phone: phone || '',
        role: isOwnerOrAdmin ? 'super_admin' : 'customer',
        addresses: [],
        createdAt: new Date().toISOString(),
      };
      
      if (db) {
        await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      }
      setUserProfile(newProfile);

      // Trigger Resend Welcome Email in the background
      emailService.sendWelcomeEmail({ to: email, name: fullName }).catch(console.warn);

      return cred.user;
    } else {
      // Local simulation
      const mockUser = {
        uid: `usr-${Date.now()}`,
        displayName: fullName,
        fullName,
        email,
        phone: phone || '+91 98200 12345',
        role: isOwnerOrAdmin ? 'super_admin' : 'customer',
        addresses: [],
        createdAt: new Date().toISOString(),
      };
      saveLocalUser(mockUser);
      emailService.sendWelcomeEmail({ to: email, name: fullName }).catch(console.warn);
      return mockUser;
    }
  };

  // Login with Email and Password
  const login = async (email, password) => {
    const isOwnerOrAdmin = checkIsAdmin(email);
    if (isFirebaseConfigured() && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user;
    } else {
      // Local simulation
      const mockUser = {
        uid: isOwnerOrAdmin ? 'usr-admin-demo' : 'usr-demo-1',
        displayName: email.split('@')[0],
        fullName: isOwnerOrAdmin ? 'Master Perfumer & Admin' : 'Faisal Al-Noor',
        email,
        phone: '+91 98765 43210',
        role: isOwnerOrAdmin || password === 'admin123' ? 'super_admin' : 'customer',
        addresses: [
          {
            id: 'addr-1',
            fullName: 'Faisal Al-Noor',
            phone: '+91 98765 43210',
            houseNumber: 'Royal Penthouse 12',
            street: 'Arabian Promenade',
            locality: 'Colaba',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400005',
            addressType: 'Home',
            isDefault: true,
          }
        ],
        createdAt: new Date().toISOString(),
      };
      saveLocalUser(mockUser);
      return mockUser;
    }
  };

  // Google Login
  const loginWithGoogle = async () => {
    if (isFirebaseConfigured() && auth && googleProvider) {
      const cred = await signInWithPopup(auth, googleProvider);
      const isOwnerOrAdmin = checkIsAdmin(cred.user.email);
      if (db) {
        try {
          const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
          if (!userDoc.exists()) {
            const profile = {
              uid: cred.user.uid,
              fullName: cred.user.displayName || 'Gentleman Patron',
              email: cred.user.email,
              phone: cred.user.phoneNumber || '',
              role: isOwnerOrAdmin ? 'super_admin' : 'customer',
              addresses: [],
              createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', cred.user.uid), profile);
            setUserProfile(profile);
            emailService.sendWelcomeEmail({ to: cred.user.email, name: cred.user.displayName }).catch(console.warn);
          }
        } catch (e) {
          console.warn('Google profile creation error:', e);
        }
      }
      return cred.user;
    } else {
      const mockUser = {
        uid: 'usr-google-demo',
        displayName: 'Google Patron',
        fullName: 'Google Patron',
        email: 'patron@google.com',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        role: 'customer',
        addresses: [],
        createdAt: new Date().toISOString(),
      };
      saveLocalUser(mockUser);
      return mockUser;
    }
  };

  // Password Reset
  const resetPassword = async (email) => {
    if (isFirebaseConfigured() && auth) {
      await sendPasswordResetEmail(auth, email);
    } else {
      console.log(`[Simulation] Password reset email simulated for: ${email}`);
    }
    return true;
  };

  // Logout
  const logout = async () => {
    if (isFirebaseConfigured() && auth) {
      await fbSignOut(auth);
    }
    setCurrentUser(null);
    setUserProfile(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  // Update Profile
  const updateProfile = async (updates) => {
    if (isFirebaseConfigured() && auth && currentUser) {
      if (updates.fullName) {
        await fbUpdateProfile(currentUser, { displayName: updates.fullName });
      }
      if (db) {
        await updateDoc(doc(db, 'users', currentUser.uid), updates);
      }
    }
    const updated = { ...(userProfile || currentUser), ...updates };
    saveLocalUser(updated);
    return updated;
  };

  // Switch Role (Development / Preview Quick Toggle)
  const toggleRole = () => {
    const newRole = userProfile?.role === 'super_admin' ? 'customer' : 'super_admin';
    const updated = {
      ...(userProfile || {
        uid: 'usr-admin-demo',
        fullName: 'Master Perfumer & Store Admin',
        email: 'admin@abnoorperfumes.com',
      }),
      role: newRole,
    };
    saveLocalUser(updated);
  };

  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'store_manager';

  const value = {
    currentUser,
    userProfile,
    isAdmin,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    updateProfile,
    toggleRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
