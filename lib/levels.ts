import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Category, Question } from '@/data/questions';

const LEVEL_PROGRESS_KEY = 'zimdrive_level_progress';

export interface Level {
  id: number;
  name: string;
  icon: string;
  questionsRequired: number;
  minCorrectPercent: number;
  unlocked: boolean;
  completed: boolean;
  currentProgress: number;
  correctAnswers: number;
  totalAttempts: number;
}

export interface CategoryLevelProgress {
  category: string;
  currentLevel: number;
  levels: Level[];
  completedLevels: number[];
}

// Level configuration - 5 levels per category
export const LEVEL_CONFIG: Omit<Level, 'unlocked' | 'completed' | 'currentProgress' | 'correctAnswers' | 'totalAttempts'>[] = [
  { id: 1, name: 'Beginner', icon: 'school', questionsRequired: 5, minCorrectPercent: 60 },
  { id: 2, name: 'Learner', icon: 'trending-up', questionsRequired: 7, minCorrectPercent: 65 },
  { id: 3, name: 'Intermediate', icon: 'psychology', questionsRequired: 8, minCorrectPercent: 70 },
  { id: 4, name: 'Advanced', icon: 'workspace-premium', questionsRequired: 10, minCorrectPercent: 75 },
  { id: 5, name: 'Expert', icon: 'emoji-events', questionsRequired: 10, minCorrectPercent: 80 },
];

export function initializeLevels(): Level[] {
  return LEVEL_CONFIG.map((config, index) => ({
    ...config,
    unlocked: index === 0, // Only first level is unlocked initially
    completed: false,
    currentProgress: 0,
    correctAnswers: 0,
    totalAttempts: 0,
  }));
}

export async function getLevelProgress(category: string): Promise<CategoryLevelProgress> {
  try {
    const raw = await AsyncStorage.getItem(LEVEL_PROGRESS_KEY);
    const allProgress: Record<string, CategoryLevelProgress> = raw ? JSON.parse(raw) : {};
    
    if (!allProgress[category]) {
      return {
        category,
        currentLevel: 1,
        levels: initializeLevels(),
        completedLevels: [],
      };
    }
    
    return allProgress[category];
  } catch {
    return {
      category,
      currentLevel: 1,
      levels: initializeLevels(),
      completedLevels: [],
    };
  }
}

export async function getAllLevelProgress(): Promise<Record<string, CategoryLevelProgress>> {
  try {
    const raw = await AsyncStorage.getItem(LEVEL_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function updateLevelProgress(
  category: string,
  levelId: number,
  correct: boolean
): Promise<{ levelCompleted: boolean; newLevelUnlocked: boolean; progress: CategoryLevelProgress }> {
  const progress = await getLevelProgress(category);
  const levelIndex = progress.levels.findIndex(l => l.id === levelId);
  
  if (levelIndex === -1) {
    return { levelCompleted: false, newLevelUnlocked: false, progress };
  }
  
  const level = progress.levels[levelIndex];
  level.totalAttempts += 1;
  if (correct) {
    level.correctAnswers += 1;
  }
  level.currentProgress = level.totalAttempts;
  
  let levelCompleted = false;
  let newLevelUnlocked = false;
  
  // Check if level is completed
  if (level.totalAttempts >= level.questionsRequired) {
    const accuracy = (level.correctAnswers / level.totalAttempts) * 100;
    
    if (accuracy >= level.minCorrectPercent) {
      level.completed = true;
      levelCompleted = true;
      
      // Add to completed levels if not already there
      if (!progress.completedLevels.includes(levelId)) {
        progress.completedLevels.push(levelId);
      }
      
      // Unlock next level if exists
      const nextLevel = progress.levels[levelIndex + 1];
      if (nextLevel && !nextLevel.unlocked) {
        nextLevel.unlocked = true;
        newLevelUnlocked = true;
        progress.currentLevel = nextLevel.id;
      }
    } else {
      // Reset level progress if failed
      level.totalAttempts = 0;
      level.correctAnswers = 0;
      level.currentProgress = 0;
    }
  }
  
  // Save progress
  await saveLevelProgress(category, progress);
  
  return { levelCompleted, newLevelUnlocked, progress };
}

export async function saveLevelProgress(category: string, progress: CategoryLevelProgress): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(LEVEL_PROGRESS_KEY);
    const allProgress: Record<string, CategoryLevelProgress> = raw ? JSON.parse(raw) : {};
    allProgress[category] = progress;
    await AsyncStorage.setItem(LEVEL_PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Failed to save level progress:', error);
  }
}

export async function resetLevelProgress(category: string): Promise<CategoryLevelProgress> {
  const progress: CategoryLevelProgress = {
    category,
    currentLevel: 1,
    levels: initializeLevels(),
    completedLevels: [],
  };
  await saveLevelProgress(category, progress);
  return progress;
}

export async function startLevel(category: string, levelId: number): Promise<CategoryLevelProgress> {
  const progress = await getLevelProgress(category);
  const level = progress.levels.find(l => l.id === levelId);
  
  if (level && level.unlocked && !level.completed) {
    // Reset progress for this level if starting fresh
    level.totalAttempts = 0;
    level.correctAnswers = 0;
    level.currentProgress = 0;
    await saveLevelProgress(category, progress);
  }
  
  return progress;
}

// Get questions for a specific level based on difficulty
export function getQuestionsForLevel(questions: Question[], levelId: number): Question[] {
  const difficultyMap: Record<number, ('easy' | 'medium' | 'hard')[]> = {
    1: ['easy'],
    2: ['easy', 'medium'],
    3: ['medium'],
    4: ['medium', 'hard'],
    5: ['hard'],
  };
  
  const allowedDifficulties = difficultyMap[levelId] || ['easy'];
  const filtered = questions.filter(q => allowedDifficulties.includes(q.difficulty));
  
  // If not enough questions of the required difficulty, include all
  if (filtered.length < 5) {
    return questions;
  }
  
  return filtered;
}

// Shuffle questions for variety
export function shuffleQuestions(questions: Question[]): Question[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
