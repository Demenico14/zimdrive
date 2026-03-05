import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import { CATEGORY_META, getQuestionsByCategory, type Category } from '@/data/questions';
import { QuestionCard } from '@/components/question-card';
import { useApp } from '@/contexts/app-context';

export default function PracticeScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { canAnswer, recordAnswer, remainingQuestions, purchased } = useApp();

  const meta = CATEGORY_META[category as Category];
  const questions = useMemo(() => getQuestionsByCategory(category as Category), [category]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

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
    },
    [currentQuestion, recordAnswer]
  );

  const handleNext = () => {
    if (!canAnswer && !purchased) {
      setShowPaywall(true);
      return;
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((p) => p + 1);
      setAnswered(false);


    }
  };

  if (!meta || !currentQuestion) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Category not found</Text>
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

  const isLast = currentIndex === questions.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {meta.label}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.scoreText, { color: colors.accent }]}>
            {sessionCorrect}/{sessionTotal}
          </Text>
        </View>
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
          {isLast ? (
            <Pressable
              onPress={() => router.back()}
              style={[styles.nextButton, { backgroundColor: colors.accent }]}>
              <Text style={styles.nextButtonText}>Finish Practice</Text>
              <MaterialIcons name="check" size={20} color="#FFFFFF" />
            </Pressable>
          ) : (
            <Pressable
              onPress={handleNext}
              style={[styles.nextButton, { backgroundColor: colors.accent }]}>
              <Text style={styles.nextButtonText}>Next Question</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
            </Pressable>
          )}
        </View>
      )}
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
    gap: 8,
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerRight: {
    width: 50,
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 15,
    fontWeight: '700',
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
