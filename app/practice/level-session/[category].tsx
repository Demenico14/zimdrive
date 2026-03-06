import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import { CATEGORY_META, getQuestionsByCategory, type Category, type Question } from '@/data/questions';
import { QuestionCard } from '@/components/question-card';
import { ConfettiCelebration } from '@/components/confetti-celebration';
import { useApp } from '@/contexts/app-context';
import { 
  getLevelProgress, 
  updateLevelProgress, 
  startLevel,
  getQuestionsForLevel,
  shuffleQuestions,
  type Level,
  LEVEL_CONFIG,
  DIFFICULTY_CONFIG,
  type DifficultyTier,
} from '@/lib/levels';

export default function LevelSessionScreen() {
  const { category, levelId, replay } = useLocalSearchParams<{ 
    category: string; 
    levelId: string;
    replay?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { canAnswer, recordAnswer, purchased } = useApp();

  const meta = CATEGORY_META[category as Category];
  const allQuestions = useMemo(() => getQuestionsByCategory(category as Category), [category]);
  const levelIdNum = parseInt(levelId, 10);
  const levelConfig = LEVEL_CONFIG.find(l => l.id === levelIdNum);
  const isReplay = replay === 'true';
  const difficultyConfig = levelConfig ? DIFFICULTY_CONFIG[levelConfig.difficulty as DifficultyTier] : null;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [levelFailed, setLevelFailed] = useState(false);

  useEffect(() => {
    initializeSession();
  }, [category, levelId]);

  const initializeSession = async () => {
    // Get questions for this level's difficulty
    const levelQuestions = getQuestionsForLevel(allQuestions, levelIdNum);
    const shuffled = shuffleQuestions(levelQuestions);
    
    // Take only the required number of questions
    const questionsNeeded = levelConfig?.questionsRequired ?? 5;
    setQuestions(shuffled.slice(0, questionsNeeded));

    // Initialize level if not replay
    if (!isReplay) {
      await startLevel(category, levelIdNum);
    }
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswer = useCallback(
    async (selectedAnswer: string, correct: boolean) => {
      setAnswered(true);
      if (correct) setSessionCorrect((p) => p + 1);
      setSessionTotal((p) => p + 1);

      await recordAnswer({
        questionId: currentQuestion.id,
        category: currentQuestion.category,
        image: currentQuestion.image,
        selectedAnswer,
        correct,
      });

      // Update level progress if not replay
      if (!isReplay) {
        const result = await updateLevelProgress(category, levelIdNum, correct);
        
        if (result.levelCompleted) {
          setLevelCompleted(true);
        }
      }
    },
    [currentQuestion, recordAnswer, category, levelIdNum, isReplay]
  );

  const handleNext = () => {
    if (!canAnswer && !purchased) {
      setShowPaywall(true);
      return;
    }

    const isLast = currentIndex === questions.length - 1;
    
    if (isLast) {
      // Check if level was completed successfully
      const accuracy = (sessionCorrect / (sessionTotal)) * 100;
      const requiredAccuracy = levelConfig?.minCorrectPercent ?? 60;
      
      if (accuracy >= requiredAccuracy) {
        setShowCelebration(true);
      } else {
        setLevelFailed(true);
        Alert.alert(
          'Level Not Passed',
          `You scored ${Math.round(accuracy)}% but needed ${requiredAccuracy}% to pass. Keep practicing!`,
          [
            { text: 'Try Again', onPress: () => router.replace({
              pathname: '/practice/level-session/[category]',
              params: { category, levelId },
            } as any) },
            { text: 'Back to Levels', onPress: () => router.back() },
          ]
        );
      }
    } else {
      setCurrentIndex((p) => p + 1);
      setAnswered(false);
    }
  };

  const handleCelebrationClose = () => {
    setShowCelebration(false);
    router.back();
  };

  if (!meta || !levelConfig || !currentQuestion) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  if (showPaywall) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={styles.paywallContent}>
          <MaterialIcons name="lock" size={48} color={colors.accent} />
          <Text style={[styles.paywallTitle, { color: colors.text }]}>Daily Limit Reached</Text>
          <Text style={[styles.paywallSub, { color: colors.textSecondary }]}>
            {"You've used all 5 free questions for today. Upgrade for unlimited access."}
          </Text>
          <Pressable
            onPress={() => router.push('/paywall')}
            style={[styles.paywallButton, { backgroundColor: colors.accent }]}>
            <Text style={styles.paywallButtonText}>Unlock All Questions - $4</Text>
          </Pressable>
          <Pressable onPress={() => router.back()} style={styles.backLink}>
            <Text style={[styles.backLinkText, { color: colors.textSecondary }]}>Go back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const progressPercent = ((currentIndex + (answered ? 1 : 0)) / questions.length) * 100;
  const isLast = currentIndex === questions.length - 1;
  const isLastLevel = levelIdNum === LEVEL_CONFIG.length;
  
  // Check if this is the last level in the current tier
  const currentTierLevels = LEVEL_CONFIG.filter(l => l.difficulty === levelConfig?.difficulty);
  const isLastInTier = levelConfig?.tier === currentTierLevels.length;
  const tierName = difficultyConfig?.name || '';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="close" size={24} color={colors.text} />
        </Pressable>
        
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progressPercent}%`,
                  backgroundColor: difficultyConfig?.color || meta.color,
                }
              ]} 
            />
          </View>
        </View>

        {/* Score */}
        <View style={styles.scoreContainer}>
          <MaterialIcons name="favorite" size={18} color={colors.wrong} />
          <Text style={[styles.scoreText, { color: colors.text }]}>
            {sessionCorrect}/{sessionTotal}
          </Text>
        </View>
      </View>

      {/* Level indicator */}
      <View style={styles.levelIndicator}>
        <View style={styles.levelBadgeRow}>
          {/* Difficulty badge */}
          {difficultyConfig && (
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyConfig.color }]}>
              <MaterialIcons name={difficultyConfig.icon as any} size={12} color="#FFFFFF" />
              <Text style={styles.difficultyText}>{difficultyConfig.name}</Text>
            </View>
          )}
          {/* Level name */}
          <View style={[styles.levelBadge, { backgroundColor: difficultyConfig?.color + '20' || meta.color + '20' }]}>
            <Text style={[styles.levelText, { color: difficultyConfig?.color || meta.color }]}>
              {levelConfig.name}
            </Text>
          </View>
        </View>
        <Text style={[styles.questionCounter, { color: colors.textSecondary }]}>
          {currentIndex + 1} / {questions.length}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
        />
      </ScrollView>

      {/* Footer */}
      {answered && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12, backgroundColor: colors.background }]}>
          <Pressable
            onPress={handleNext}
            style={[styles.nextButton, { backgroundColor: difficultyConfig?.color || meta.color }]}>
            <Text style={styles.nextButtonText}>
              {isLast ? 'Complete Level' : 'Next Question'}
            </Text>
            <MaterialIcons 
              name={isLast ? 'check' : 'arrow-forward'} 
              size={20} 
              color="#FFFFFF" 
            />
          </Pressable>
        </View>
      )}

      {/* Celebration modal */}
      <ConfettiCelebration
        visible={showCelebration}
        onClose={handleCelebrationClose}
        levelName={levelConfig.name}
        correctCount={sessionCorrect}
        totalCount={sessionTotal}
        categoryColor={difficultyConfig?.color || meta.color}
        isLastLevel={isLastLevel}
        isTierComplete={isLastInTier && !isLastLevel}
        tierName={tierName}
        onContinue={handleCelebrationClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  progressContainer: {
    flex: 1,
  },
  progressBg: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreText: {
    fontSize: 15,
    fontWeight: '700',
  },
  levelIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  levelBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  levelText: {
    fontSize: 13,
    fontWeight: '600',
  },
  questionCounter: {
    fontSize: 13,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  paywallContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  paywallTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
  },
  paywallSub: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  paywallButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.lg,
    marginTop: 8,
  },
  paywallButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backLink: {
    padding: 8,
    marginTop: 4,
  },
  backLinkText: {
    fontSize: 15,
  },
});
