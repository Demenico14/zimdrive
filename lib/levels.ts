import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Category, Question } from '@/data/questions';

const LEVEL_PROGRESS_KEY = 'zimdrive_level_progress';

export type DifficultyTier = 'easy' | 'medium' | 'hard';

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
  difficulty: DifficultyTier;
  tier: number; // Level within the difficulty tier (1, 2, 3, etc.)
}

export interface DifficultySection {
  difficulty: DifficultyTier;
  name: string;
  description: string;
  icon: string;
  color: string;
  levels: Level[];
  unlocked: boolean;
  completed: boolean;
}

export interface CategoryLevelProgress {
  category: string;
  currentLevel: number;
  levels: Level[];
  completedLevels: number[];
  sections: DifficultySection[];
}

// Difficulty tier configuration
export const DIFFICULTY_CONFIG: Record<DifficultyTier, { name: string; description: string; icon: string; color: string }> = {
  easy: {
    name: 'Easy',
    description: 'Master the basics',
    icon: 'school',
    color: '#22C55E', // Green
  },
  medium: {
    name: 'Medium',
    description: 'Build your skills',
    icon: 'trending-up',
    color: '#F59E0B', // Amber
  },
  hard: {
    name: 'Hard',
    description: 'Prove your expertise',
    icon: 'local-fire-department',
    color: '#EF4444', // Red
  },
};

// Level configuration - 3 levels per difficulty tier (Easy, Medium, Hard)
export const LEVEL_CONFIG: Omit<Level, 'unlocked' | 'completed' | 'currentProgress' | 'correctAnswers' | 'totalAttempts'>[] = [
  // Easy Tier - 3 levels
  { id: 1, name: 'Foundation', icon: 'stars', questionsRequired: 4, minCorrectPercent: 60, difficulty: 'easy', tier: 1 },
  { id: 2, name: 'Basics', icon: 'lightbulb', questionsRequired: 5, minCorrectPercent: 65, difficulty: 'easy', tier: 2 },
  { id: 3, name: 'Essentials', icon: 'school', questionsRequired: 5, minCorrectPercent: 70, difficulty: 'easy', tier: 3 },
  
  // Medium Tier - 3 levels
  { id: 4, name: 'Developing', icon: 'trending-up', questionsRequired: 6, minCorrectPercent: 70, difficulty: 'medium', tier: 1 },
  { id: 5, name: 'Proficient', icon: 'psychology', questionsRequired: 6, minCorrectPercent: 75, difficulty: 'medium', tier: 2 },
  { id: 6, name: 'Skilled', icon: 'speed', questionsRequired: 7, minCorrectPercent: 75, difficulty: 'medium', tier: 3 },
  
  // Hard Tier - 3 levels
  { id: 7, name: 'Advanced', icon: 'local-fire-department', questionsRequired: 7, minCorrectPercent: 75, difficulty: 'hard', tier: 1 },
  { id: 8, name: 'Expert', icon: 'workspace-premium', questionsRequired: 8, minCorrectPercent: 80, difficulty: 'hard', tier: 2 },
  { id: 9, name: 'Master', icon: 'emoji-events', questionsRequired: 8, minCorrectPercent: 85, difficulty: 'hard', tier: 3 },
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

export function initializeSections(levels: Level[]): DifficultySection[] {
  const difficulties: DifficultyTier[] = ['easy', 'medium', 'hard'];
  
  return difficulties.map((difficulty, index) => {
    const config = DIFFICULTY_CONFIG[difficulty];
    const sectionLevels = levels.filter(l => l.difficulty === difficulty);
    const allCompleted = sectionLevels.length > 0 && sectionLevels.every(l => l.completed);
    const anyUnlocked = sectionLevels.some(l => l.unlocked);
    
    return {
      difficulty,
      name: config.name,
      description: config.description,
      icon: config.icon,
      color: config.color,
      levels: sectionLevels,
      unlocked: index === 0 || anyUnlocked, // Easy is always unlocked, others unlock when first level unlocks
      completed: allCompleted,
    };
  });
}

export async function getLevelProgress(category: string): Promise<CategoryLevelProgress> {
  try {
    const raw = await AsyncStorage.getItem(LEVEL_PROGRESS_KEY);
    const allProgress: Record<string, CategoryLevelProgress> = raw ? JSON.parse(raw) : {};
    
    if (!allProgress[category]) {
      const levels = initializeLevels();
      return {
        category,
        currentLevel: 1,
        levels,
        completedLevels: [],
        sections: initializeSections(levels),
      };
    }
    
    // Ensure sections are up to date
    const progress = allProgress[category];
    progress.sections = initializeSections(progress.levels);
    return progress;
  } catch {
    const levels = initializeLevels();
    return {
      category,
      currentLevel: 1,
      levels,
      completedLevels: [],
      sections: initializeSections(levels),
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
  const levels = initializeLevels();
  const progress: CategoryLevelProgress = {
    category,
    currentLevel: 1,
    levels,
    completedLevels: [],
    sections: initializeSections(levels),
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

// Get questions for a specific level based on difficulty tier
export function getQuestionsForLevel(questions: Question[], levelId: number): Question[] {
  const level = LEVEL_CONFIG.find(l => l.id === levelId);
  if (!level) return questions;
  
  // Get questions matching the level's difficulty tier
  const filtered = questions.filter(q => q.difficulty === level.difficulty);
  
  // If not enough questions of the required difficulty, include all
  if (filtered.length < level.questionsRequired) {
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
