import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import { QUESTIONS, type Question } from '@/data/questions';
import { getWrongAttempts } from '@/lib/storage';
import { QuestionCard } from '@/components/question-card';
import { useApp } from '@/contexts/app-context';

export default function ReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { recordAnswer } = useApp();

  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWrongAttempts().then((attempts) => {
      const questionIds = new Set(attempts.map((a) => a.questionId));
      const questions = QUESTIONS.filter((q) => questionIds.has(q.id));
      setWrongQuestions(questions);
      setLoading(false);
    });
  }, []);

  const handleAnswer = useCallback(
    async (selectedAnswer: string, correct: boolean) => {
      setAnswered(true);
      const q = wrongQuestions[currentIndex];
      await recordAnswer({
        questionId: q.id,
        category: q.category,
        selectedAnswer,
        correct,
      });
    },
    [wrongQuestions, currentIndex, recordAnswer]
  );

  const handleNext = () => {
    if (currentIndex < wrongQuestions.length - 1) {
      setCurrentIndex((p) => p + 1);
      setAnswered(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>Loading...</Text>
      </View>
    );
  }

  if (wrongQuestions.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backButton, { top: insets.top + 12 }]}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.emptyContent}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.correctBg }]}>
            <MaterialIcons name="emoji-events" size={48} color={colors.correct} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Wrong Answers</Text>
          <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
            {"You haven't gotten any questions wrong yet, or you've corrected them all. Keep practising!"}
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={[styles.emptyButton, { backgroundColor: colors.accent }]}>
            <Text style={styles.emptyButtonText}>Back to Home</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const currentQuestion = wrongQuestions[currentIndex];
  const isLast = currentIndex === wrongQuestions.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Review Wrong Answers</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={wrongQuestions.length}
          onAnswer={handleAnswer}
        />
      </ScrollView>

      {answered && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12, backgroundColor: colors.background }]}>
          {isLast ? (
            <Pressable
              onPress={() => router.back()}
              style={[styles.nextButton, { backgroundColor: colors.accent }]}>
              <Text style={styles.nextButtonText}>Done Reviewing</Text>
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 16, fontWeight: '600' },
  scrollContent: { padding: 20, paddingBottom: 120 },
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
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    padding: 4,
  },
  emptyContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  emptySub: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: BorderRadius.lg,
    marginTop: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
