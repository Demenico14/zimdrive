import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import { CATEGORY_META, getQuestionsByCategory, type Category } from '@/data/questions';
import { DifficultyPath } from '@/components/difficulty-path';
import { ConfettiCelebration } from '@/components/confetti-celebration';
import { 
  getLevelProgress, 
  type Level, 
  type CategoryLevelProgress,
  LEVEL_CONFIG,
  DIFFICULTY_CONFIG,
} from '@/lib/levels';

export default function CategoryLevelsScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const meta = CATEGORY_META[category as Category];
  const questions = useMemo(() => getQuestionsByCategory(category as Category), [category]);

  const [progress, setProgress] = useState<CategoryLevelProgress | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    levelName: string;
    correctCount: number;
    totalCount: number;
    isLastLevel: boolean;
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [category])
  );

  const loadProgress = async () => {
    const p = await getLevelProgress(category);
    setProgress(p);
  };

  const handleSelectLevel = (level: Level) => {
    if (level.unlocked && !level.completed) {
      router.push({
        pathname: '/practice/level-session/[category]',
        params: { 
          category, 
          levelId: level.id.toString(),
        },
      } as any);
    } else if (level.completed) {
      // Allow replay of completed levels
      router.push({
        pathname: '/practice/level-session/[category]',
        params: { 
          category, 
          levelId: level.id.toString(),
          replay: 'true',
        },
      } as any);
    }
  };

  const completedCount = progress?.completedLevels.length ?? 0;
  const totalLevels = LEVEL_CONFIG.length;
  const progressPercent = (completedCount / totalLevels) * 100;
  
  // Calculate section completions
  const easySectionComplete = progress?.sections.find(s => s.difficulty === 'easy')?.completed ?? false;
  const mediumSectionComplete = progress?.sections.find(s => s.difficulty === 'medium')?.completed ?? false;
  const hardSectionComplete = progress?.sections.find(s => s.difficulty === 'hard')?.completed ?? false;

  if (!meta || !progress) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: meta.color }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerSubtitle}>LEARNING PATH</Text>
          <Text style={styles.headerTitle}>{meta.label}</Text>
        </View>
        <View style={styles.headerRight}>
          <Pressable 
            onPress={() => router.push(`/practice/${category}` as any)}
            style={styles.freePlayButton}
          >
            <MaterialIcons name="shuffle" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      {/* Progress summary */}
      <View style={[styles.progressSummary, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.progressInfo}>
          <View style={[styles.iconBadge, { backgroundColor: meta.color + '20' }]}>
            <MaterialIcons name={meta.icon as any} size={24} color={meta.color} />
          </View>
          <View style={styles.progressTextContainer}>
            <Text style={[styles.progressTitle, { color: colors.text }]}>
              {completedCount === totalLevels ? 'Category Mastered!' : `${completedCount} of ${totalLevels} Levels Complete`}
            </Text>
            <Text style={[styles.progressSubtitle, { color: colors.textSecondary }]}>
              {questions.length} questions across all difficulties
            </Text>
          </View>
        </View>
        
        {/* Overall progress bar */}
        <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
          <View 
            style={[
              styles.progressBarFill, 
              { 
                width: `${progressPercent}%`, 
                backgroundColor: meta.color 
              }
            ]} 
          />
        </View>
        
        {/* Difficulty tier indicators */}
        <View style={styles.tierIndicators}>
          <View style={styles.tierItem}>
            <View 
              style={[
                styles.tierDot, 
                { backgroundColor: easySectionComplete ? DIFFICULTY_CONFIG.easy.color : colors.border }
              ]} 
            />
            <Text 
              style={[
                styles.tierLabel, 
                { color: easySectionComplete ? DIFFICULTY_CONFIG.easy.color : colors.textSecondary }
              ]}
            >
              Easy
            </Text>
          </View>
          <View style={[styles.tierConnector, { backgroundColor: easySectionComplete ? DIFFICULTY_CONFIG.easy.color : colors.border }]} />
          <View style={styles.tierItem}>
            <View 
              style={[
                styles.tierDot, 
                { backgroundColor: mediumSectionComplete ? DIFFICULTY_CONFIG.medium.color : colors.border }
              ]} 
            />
            <Text 
              style={[
                styles.tierLabel, 
                { color: mediumSectionComplete ? DIFFICULTY_CONFIG.medium.color : colors.textSecondary }
              ]}
            >
              Medium
            </Text>
          </View>
          <View style={[styles.tierConnector, { backgroundColor: mediumSectionComplete ? DIFFICULTY_CONFIG.medium.color : colors.border }]} />
          <View style={styles.tierItem}>
            <View 
              style={[
                styles.tierDot, 
                { backgroundColor: hardSectionComplete ? DIFFICULTY_CONFIG.hard.color : colors.border }
              ]} 
            />
            <Text 
              style={[
                styles.tierLabel, 
                { color: hardSectionComplete ? DIFFICULTY_CONFIG.hard.color : colors.textSecondary }
              ]}
            >
              Hard
            </Text>
          </View>
        </View>
      </View>

      {/* Difficulty-based level path */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DifficultyPath
          progress={progress}
          categoryColor={meta.color}
          onSelectLevel={handleSelectLevel}
        />
      </ScrollView>

      {/* Celebration modal */}
      {celebrationData && (
        <ConfettiCelebration
          visible={showCelebration}
          onClose={() => {
            setShowCelebration(false);
            setCelebrationData(null);
          }}
          levelName={celebrationData.levelName}
          correctCount={celebrationData.correctCount}
          totalCount={celebrationData.totalCount}
          categoryColor={meta.color}
          isLastLevel={celebrationData.isLastLevel}
          onContinue={() => {
            setShowCelebration(false);
            setCelebrationData(null);
            if (celebrationData.isLastLevel) {
              router.back();
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 44,
    alignItems: 'flex-end',
  },
  freePlayButton: {
    padding: 8,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressSummary: {
    marginHorizontal: 16,
    marginTop: -20,
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTextContainer: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  tierIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  tierItem: {
    alignItems: 'center',
    gap: 4,
  },
  tierDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tierLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tierConnector: {
    width: 32,
    height: 2,
    marginHorizontal: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
});
