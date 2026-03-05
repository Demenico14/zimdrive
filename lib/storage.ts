import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ATTEMPTS: 'zimdrive_attempts',
  DAILY_QUOTA: 'zimdrive_daily_quota',
  PURCHASE: 'zimdrive_purchase',
  ONBOARDING: 'zimdrive_onboarding_done',
  BOOKMARKS: 'zimdrive_bookmarks',
};

// ── Attempt Tracking ──

export interface Attempt {
  questionId: number;
  category: string;
  image?: string;
  selectedAnswer: string;
  correct: boolean;
  timestamp: number;
}

export async function getAttempts(): Promise<Attempt[]> {
  const raw = await AsyncStorage.getItem(KEYS.ATTEMPTS);
  return raw ? JSON.parse(raw) : [];
}

export async function saveAttempt(attempt: Attempt): Promise<void> {
  const existing = await getAttempts();
  existing.push(attempt);
  await AsyncStorage.setItem(KEYS.ATTEMPTS, JSON.stringify(existing));
}

export async function getAttemptsByCategory(category: string): Promise<Attempt[]> {
  const all = await getAttempts();
  return all.filter((a) => a.category === category);
}

export async function getWrongAttempts(): Promise<Attempt[]> {
  const all = await getAttempts();
  const latestByQuestion = new Map<number, Attempt>();
  for (const a of all) {
    latestByQuestion.set(a.questionId, a);
  }
  return Array.from(latestByQuestion.values()).filter((a) => !a.correct);
}

// ─��� Daily Quota ──

interface DailyQuota {
  date: string; // YYYY-MM-DD in Africa/Harare
  count: number;
}

function getTodayHarare(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Harare' });
}

export async function getDailyQuota(): Promise<DailyQuota> {
  const raw = await AsyncStorage.getItem(KEYS.DAILY_QUOTA);
  if (!raw) return { date: getTodayHarare(), count: 0 };
  const quota: DailyQuota = JSON.parse(raw);
  if (quota.date !== getTodayHarare()) {
    return { date: getTodayHarare(), count: 0 };
  }
  return quota;
}

export async function incrementDailyQuota(): Promise<DailyQuota> {
  const quota = await getDailyQuota();
  quota.count += 1;
  quota.date = getTodayHarare();
  await AsyncStorage.setItem(KEYS.DAILY_QUOTA, JSON.stringify(quota));
  return quota;
}

export const FREE_DAILY_LIMIT = 5;

export async function canAnswerQuestion(): Promise<boolean> {
  const purchased = await isPurchased();
  if (purchased) return true;
  const quota = await getDailyQuota();
  return quota.count < FREE_DAILY_LIMIT;
}

export async function getRemainingQuestions(): Promise<number> {
  const purchased = await isPurchased();
  if (purchased) return Infinity;
  const quota = await getDailyQuota();
  return Math.max(0, FREE_DAILY_LIMIT - quota.count);
}

// ── Purchase State ──

interface PurchaseState {
  purchased: boolean;
  receiptToken?: string;
  purchaseDate?: number;
}

export async function isPurchased(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEYS.PURCHASE);
  if (!raw) return false;
  const state: PurchaseState = JSON.parse(raw);
  return state.purchased;
}

export async function setPurchased(receiptToken?: string): Promise<void> {
  const state: PurchaseState = {
    purchased: true,
    receiptToken,
    purchaseDate: Date.now(),
  };
  await AsyncStorage.setItem(KEYS.PURCHASE, JSON.stringify(state));
}

// ── Onboarding ──

export async function hasCompletedOnboarding(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.ONBOARDING);
  return val === 'true';
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDING, 'true');
}

// ── Bookmarks ──

export async function getBookmarks(): Promise<number[]> {
  const raw = await AsyncStorage.getItem(KEYS.BOOKMARKS);
  return raw ? JSON.parse(raw) : [];
}

export async function toggleBookmark(questionId: number): Promise<boolean> {
  const bookmarks = await getBookmarks();
  const index = bookmarks.indexOf(questionId);
  if (index >= 0) {
    bookmarks.splice(index, 1);
    await AsyncStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    return false;
  } else {
    bookmarks.push(questionId);
    await AsyncStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    return true;
  }
}

// ── Stats ──

export interface CategoryStats {
  category: string;
  total: number;
  correct: number;
  accuracy: number;
}

export async function getCategoryStats(): Promise<CategoryStats[]> {
  const attempts = await getAttempts();
  const stats = new Map<string, { total: number; correct: number }>();

  for (const a of attempts) {
    const current = stats.get(a.category) || { total: 0, correct: 0 };
    current.total += 1;
    if (a.correct) current.correct += 1;
    stats.set(a.category, current);
  }

  return Array.from(stats.entries()).map(([category, { total, correct }]) => ({
    category,
    total,
    correct,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
  }));
}

export async function getOverallStats(): Promise<{
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
  streak: number;
}> {
  const attempts = await getAttempts();
  const totalAnswered = attempts.length;
  const totalCorrect = attempts.filter((a) => a.correct).length;

  let streak = 0;
  for (let i = attempts.length - 1; i >= 0; i--) {
    if (attempts[i].correct) streak++;
    else break;
  }

  return {
    totalAnswered,
    totalCorrect,
    accuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
    streak,
  };
}

// ── Reset (for testing) ──
export async function resetAllData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
