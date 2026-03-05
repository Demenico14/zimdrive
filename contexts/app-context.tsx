import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import {
  canAnswerQuestion,
  getOverallStats,
  getRemainingQuestions,
  hasCompletedOnboarding,
  incrementDailyQuota,
  isPurchased,
  saveAttempt,
  setOnboardingComplete,
  setPurchased as setPurchasedStorage,
  FREE_DAILY_LIMIT,
  type Attempt,
} from '@/lib/storage';
import {
  onAuthStateChanged as firebaseOnAuthStateChanged,
  firebaseSignOut,
} from '@/lib/firebase-auth';

interface AppContextType {
  isLoading: boolean;
  onboardingDone: boolean;
  completeOnboarding: () => Promise<void>;
  user: FirebaseAuthTypes.User | null;
  loggedIn: boolean;
  logout: () => Promise<void>;
  purchased: boolean;
  setPurchased: () => Promise<void>;
  remainingQuestions: number;
  canAnswer: boolean;
  recordAnswer: (attempt: Omit<Attempt, 'timestamp'>) => Promise<void>;
  overallStats: { totalAnswered: number; totalCorrect: number; accuracy: number; streak: number };
  refreshStats: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [purchased, setPurchasedState] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState(FREE_DAILY_LIMIT);
  const [canAnswer, setCanAnswer] = useState(true);
  const [overallStats, setOverallStats] = useState({
    totalAnswered: 0,
    totalCorrect: 0,
    accuracy: 0,
    streak: 0,
  });

  const refreshStats = useCallback(async () => {
    const [stats, remaining, canAns, isPaid] = await Promise.all([
      getOverallStats(),
      getRemainingQuestions(),
      canAnswerQuestion(),
      isPurchased(),
    ]);
    setOverallStats(stats);
    setRemainingQuestions(remaining);
    setCanAnswer(canAns);
    setPurchasedState(isPaid);
  }, []);

  // Firebase auth state listener + local data init
  useEffect(() => {
    let localDataLoaded = false;

    async function loadLocalData() {
      const [obDone, paid, remaining, canAns, stats] = await Promise.all([
        hasCompletedOnboarding(),
        isPurchased(),
        getRemainingQuestions(),
        canAnswerQuestion(),
        getOverallStats(),
      ]);
      setOnboardingDone(obDone);
      setPurchasedState(paid);
      setRemainingQuestions(remaining);
      setCanAnswer(canAns);
      setOverallStats(stats);
      localDataLoaded = true;
    }

    // Start loading local data immediately
    loadLocalData();

    // Subscribe to Firebase auth state
  // Small delay to ensure Firebase native module is ready
  const timer = setTimeout(() => {
    const unsubscribe = firebaseOnAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (localDataLoaded) {
        setIsLoading(false);
      } else {
        const checkReady = setInterval(() => {
          if (localDataLoaded) {
            setIsLoading(false);
            clearInterval(checkReady);
          }
        }, 50);
      }
    });
    return () => unsubscribe();
  }, 100);

  return () => clearTimeout(timer);
}, []);

  const completeOnboarding = useCallback(async () => {
    await setOnboardingComplete();
    setOnboardingDone(true);
  }, []);

  const handleLogout = useCallback(async () => {
    await firebaseSignOut();
    // onAuthStateChanged will set user to null
  }, []);

  const handleSetPurchased = useCallback(async () => {
    await setPurchasedStorage();
    setPurchasedState(true);
    setCanAnswer(true);
    setRemainingQuestions(Infinity);
  }, []);

  const recordAnswer = useCallback(
    async (attempt: Omit<Attempt, 'timestamp'>) => {
      const fullAttempt: Attempt = { ...attempt, timestamp: Date.now() };
      await saveAttempt(fullAttempt);
      if (!purchased) {
        await incrementDailyQuota();
      }
      await refreshStats();
    },
    [purchased, refreshStats]
  );

  return (
    <AppContext.Provider
      value={{
        isLoading,
        onboardingDone,
        completeOnboarding,
        user,
        loggedIn: !!user,
        logout: handleLogout,
        purchased,
        setPurchased: handleSetPurchased,
        remainingQuestions,
        canAnswer,
        recordAnswer,
        overallStats,
        refreshStats,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
