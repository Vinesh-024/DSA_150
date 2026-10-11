import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  auth,
  signInWithGoogle,
  signOutUser,
  subscribeToAuthState,
  syncProblemStatesToCloud,
  fetchProblemStatesFromCloud,
  fetchSubmissionsFromCloud,
  uploadBackupToFirebaseStorage,
  testConnection
} from '../services/firebase';
import {
  loadAllProblemStates,
  saveAllProblemStates,
  loadAllSubmissions,
  saveSubmission,
  exportAllDataAsJson
} from '../services/storageService';
import { UserProblemState } from '../types/curriculum';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  syncWithCloud: () => Promise<boolean>;
  backupToCloudStorage: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isSyncing: false,
  lastSyncedAt: null,
  signIn: async () => {},
  signOut: async () => {},
  syncWithCloud: async () => false,
  backupToCloudStorage: async () => null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  useEffect(() => {
    // Initial connection test
    testConnection().catch(console.warn);

    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Auto-sync on sign-in
      if (currentUser) {
        syncWithCloud(currentUser.uid).catch(console.error);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const signedInUser = await signInWithGoogle();
      setUser(signedInUser);
      await syncWithCloud(signedInUser.uid);
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const syncWithCloud = useCallback(async (targetUid?: string): Promise<boolean> => {
    const activeUid = targetUid || user?.uid;
    if (!activeUid) return false;

    try {
      setIsSyncing(true);

      // 1. Fetch remote problem states from Firestore
      const remoteStates = await fetchProblemStatesFromCloud(activeUid);
      const localStates = loadAllProblemStates();

      // Merge remote and local states (prefer whichever has more progress or latest attempt)
      const mergedStates: Record<string, UserProblemState> = { ...localStates };
      let updatedCount = 0;

      for (const [probId, remoteState] of Object.entries(remoteStates)) {
        const local = localStates[probId];
        if (!local) {
          mergedStates[probId] = remoteState;
          updatedCount++;
        } else {
          // If remote is mastered/redo or has higher attempts/confidence
          const remoteAttemptTime = remoteState.lastAttemptTimestamp ? new Date(remoteState.lastAttemptTimestamp).getTime() : 0;
          const localAttemptTime = local.lastAttemptTimestamp ? new Date(local.lastAttemptTimestamp).getTime() : 0;
          if (remoteAttemptTime > localAttemptTime || (remoteState.status !== 'not_started' && local.status === 'not_started')) {
            mergedStates[probId] = {
              ...local,
              ...remoteState
            };
            updatedCount++;
          }
        }
      }

      // Save merged locally
      saveAllProblemStates(mergedStates);

      // Push all local progress up to Firestore
      await syncProblemStatesToCloud(activeUid, mergedStates);

      // 2. Fetch remote submissions and merge
      const remoteSubmissions = await fetchSubmissionsFromCloud(activeUid);
      const localSubmissions = loadAllSubmissions();
      const localSubIds = new Set(localSubmissions.map(s => s.id));

      for (const remSub of remoteSubmissions) {
        if (!localSubIds.has(remSub.id)) {
          saveSubmission(remSub);
        }
      }

      setLastSyncedAt(new Date());
      return true;
    } catch (err) {
      console.error('Cloud synchronization error:', err);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

  const backupToCloudStorage = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    try {
      setIsSyncing(true);
      const fullJson = exportAllDataAsJson();
      const downloadUrl = await uploadBackupToFirebaseStorage(user.uid, fullJson);
      return downloadUrl;
    } catch (e) {
      console.error('Storage backup error:', e);
      throw e;
    } finally {
      setIsSyncing(false);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSyncing,
        lastSyncedAt,
        signIn: handleSignIn,
        signOut: handleSignOut,
        syncWithCloud,
        backupToCloudStorage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
