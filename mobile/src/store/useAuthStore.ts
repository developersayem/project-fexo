import { create } from 'zustand';
import { User } from '@/types';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile,
  signInWithCredential,
  GoogleAuthProvider
} from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from '../services/firebase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuthListener: () => () => void;
}

let unsubscribe: (() => void) | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to login with Firebase', error);
      throw error;
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
      if (!webClientId || webClientId === 'YOUR_GOOGLE_WEB_CLIENT_ID_HERE') {
        throw new Error('Google Web Client ID is not configured in mobile/.env');
      }

      GoogleSignin.configure({
        webClientId: webClientId,
      });

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();
      
      // Safely narrow down type depending on google-signin library version
      let idToken: string | null = null;
      if (response && 'type' in response) {
        if (response.type === 'success' && response.data) {
          idToken = response.data.idToken;
        } else {
          throw new Error('Google Sign-In: Operation cancelled or failed.');
        }
      } else if (response && 'idToken' in response) {
        idToken = (response as any).idToken;
      }

      if (!idToken) {
        throw new Error('Google Sign-In: No ID Token retrieved.');
      }

      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to login with Google', error);
      throw error;
    }
  },

  register: async (email: string, password: string, firstName: string, lastName: string) => {
    set({ isLoading: true });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const displayName = `${firstName} ${lastName}`.trim();
      await updateProfile(userCredential.user, {
        displayName: displayName,
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to register with Firebase', error);
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await firebaseSignOut(auth);
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        console.warn('Google Sign-out warning (not critical):', e);
      }
    } catch (error) {
      console.error('Failed to log out from Firebase', error);
      set({ isLoading: false });
    }
  },

  initializeAuthListener: () => {
    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const nameParts = (firebaseUser.displayName || '').split(' ');
        const firstName = nameParts[0] || 'User';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        const userObj: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          firstName,
          lastName,
          avatarUrl: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'
        };
        set({
          user: userObj,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    });

    return unsubscribe;
  }
}));
