import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocFromServer,
  collection,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  getBytes
} from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  UserProblemState,
  SubmissionRecord
} from '../types/curriculum';
import { DailyRoutineState } from './storageService';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with specific database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot as required by Firestore integration guidelines
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, local cache in use.');
    }
    return false;
  }
}

// Authentication Actions
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Upsert user profile document
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        userId: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Coder',
        photoURL: user.photoURL || '',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Profile sync warning:', e);
    }

    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Cloud Sync Helpers

/**
 * Push all local problem states to Firestore
 */
export async function syncProblemStatesToCloud(userId: string, states: Record<string, UserProblemState>): Promise<void> {
  const path = `users/${userId}/problem_states`;
  try {
    // Write in batches of up to 400 docs
    const entries = Object.entries(states);
    const batchSize = 350;
    for (let i = 0; i < entries.length; i += batchSize) {
      const chunk = entries.slice(i, i + batchSize);
      const batch = writeBatch(db);
      for (const [probId, state] of chunk) {
        const ref = doc(db, path, probId);
        batch.set(ref, {
          ...state,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch problem states from Firestore
 */
export async function fetchProblemStatesFromCloud(userId: string): Promise<Record<string, UserProblemState>> {
  const path = `users/${userId}/problem_states`;
  try {
    const colRef = collection(db, path);
    const snapshot = await getDocs(colRef);
    const results: Record<string, UserProblemState> = {};
    snapshot.forEach(docSnap => {
      results[docSnap.id] = docSnap.data() as UserProblemState;
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Push submission to Firestore
 */
export async function saveSubmissionToCloud(userId: string, submission: SubmissionRecord): Promise<void> {
  const path = `users/${userId}/submissions/${submission.id}`;
  try {
    const subRef = doc(db, 'users', userId, 'submissions', submission.id);
    await setDoc(subRef, submission);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Fetch all submissions from Firestore
 */
export async function fetchSubmissionsFromCloud(userId: string): Promise<SubmissionRecord[]> {
  const path = `users/${userId}/submissions`;
  try {
    const colRef = collection(db, path);
    const snapshot = await getDocs(colRef);
    const results: SubmissionRecord[] = [];
    snapshot.forEach(docSnap => {
      results.push(docSnap.data() as SubmissionRecord);
    });
    return results.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Push daily routine to Firestore
 */
export async function saveDailyRoutineToCloud(userId: string, routine: DailyRoutineState): Promise<void> {
  const path = `users/${userId}/daily_routines/${routine.date}`;
  try {
    const routineRef = doc(db, 'users', userId, 'daily_routines', routine.date);
    await setDoc(routineRef, {
      ...routine,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch daily routine from Firestore
 */
export async function fetchDailyRoutineFromCloud(userId: string, date: string): Promise<DailyRoutineState | null> {
  const path = `users/${userId}/daily_routines/${date}`;
  try {
    const routineRef = doc(db, 'users', userId, 'daily_routines', date);
    const docSnap = await getDoc(routineRef);
    if (docSnap.exists()) {
      return docSnap.data() as DailyRoutineState;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Firebase Cloud Storage Support: Backups and Code Snapshots
export async function uploadBackupToFirebaseStorage(userId: string, backupJsonString: string): Promise<string> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const storagePath = `users/${userId}/backups/backup_${timestamp}.json`;
    const storageReference = ref(storage, storagePath);

    await uploadString(storageReference, backupJsonString, 'raw', {
      contentType: 'application/json'
    });

    const downloadUrl = await getDownloadURL(storageReference);
    return downloadUrl;
  } catch (error) {
    console.error('Firebase Storage upload error:', error);
    throw error;
  }
}

export async function uploadSolutionSnippetToStorage(
  userId: string,
  problemId: string,
  language: string,
  code: string
): Promise<string> {
  try {
    const timestamp = Date.now();
    const storagePath = `users/${userId}/snippets/${problemId}_${language}_${timestamp}.txt`;
    const storageReference = ref(storage, storagePath);

    await uploadString(storageReference, code, 'raw', {
      contentType: 'text/plain'
    });

    const downloadUrl = await getDownloadURL(storageReference);
    return downloadUrl;
  } catch (error) {
    console.error('Firebase Storage code snippet upload error:', error);
    throw error;
  }
}
