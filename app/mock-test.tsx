import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import { getRandomQuestions, type Question } from '@/data/questions';
import { useApp } from '@/contexts/app-context';

const MOCK_TEST_COUNT = 20;
const MOCK_TEST_DURATION = 30 * 60; // 30 minutes in seconds

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

export default function MockTestScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { canAnswer, recordAnswer, purchased } = useApp();

  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MOCK_TEST_DURATION);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);

  const questions = useMemo(() => getRandomQuestions(MOCK_TEST_COUNT), []);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer
  useEffect(() => {
    if (!started || finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleFinish();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleFinish = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFinished(true);

    // Record all answers
    const results: { correct: number; total: number; answers: Record<number, { selected: string; correct: boolean }> } = {
      correct: 0,
      total: questions.length,
      answers: {},
    };

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const selected = answers[i] || '';
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) results.correct += 1;
      results.answers[i] = { selected, correct: isCorrect };

      if (selected) {
        await recordAnswer({
          questionId: q.id,
          category: q.category,
          selectedAnswer: selected,
          correct: isCorrect,
        });
      }
    }

    // Navigate to results
    router.replace({
      pathname: '/mock-results',
      params: {
        correct: results.correct.toString(),
        total: results.total.toString(),
        timeUsed: (MOCK_TEST_DURATION - timeLeft).toString(),
        questionsData: JSON.stringify(
          questions.map((q, i) => ({
            id: q.id,
            question: q.question,
            correctAnswer: q.correctAnswer,
            selectedAnswer: answers[i] || '',
            correct: (answers[i] || '') === q.correctAnswer,
            explanation: q.explanation,
            options: q.options,
          }))
        ),
      },
    });
  }, [answers, questions, timeLeft, recordAnswer, router]);

  const handleQuit = () => {
    Alert.alert(
      'Quit Test?',
      'Your progress will be lost. Are you sure?',
      [
        { text: 'Continue Test', style: 'cancel' },
        { text: 'Quit', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  // Start screen
  if (!started) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.startContent}>
          <View style={[styles.startIcon, { backgroundColor: colors.accentLight }]}>
            <MaterialIcons name="timer" size={56} color={colors.accent} />
          </View>
          <Text style={[styles.startTitle, { color: colors.text }]}>Mock Test</Text>
          <Text style={[styles.startSub, { color: colors.textSecondary }]}>
            {MOCK_TEST_COUNT} random questions in {MOCK_TEST_DURATION / 60} minutes.{'\n'}
            Simulate the real VID theory exam.
          </Text>

          <View style={[styles.infoRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.infoItem}>
              <MaterialIcons name="help-outline" size={20} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.text }]}>{MOCK_TEST_COUNT} Questions</Text>
            </View>
            <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
            <View style={styles.infoItem}>
              <MaterialIcons name="timer" size={20} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.text }]}>{MOCK_TEST_DURATION / 60} Minutes</Text>
            </View>
            <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
            <View style={styles.infoItem}>
              <MaterialIcons name="grade" size={20} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.text }]}>Pass: 70%</Text>
            </View>
          </View>

          <Pressable
            onPress={() => setStarted(true)}
            style={[styles.startButton, { backgroundColor: colors.accent }]}>
            <Text style={styles.startButtonText}>Start Test</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with timer */}
      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={handleQuit} style={styles.quitButton}>
          <MaterialIcons name="close" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.timerContainer}>
          <MaterialIcons
            name="timer"
            size={18}
            color={timeLeft < 300 ? colors.wrong : colors.accent}
          />
          <Text
            style={[
              styles.timerText,
              { color: timeLeft < 300 ? colors.wrong : colors.text },
            ]}>
            {formatTime(timeLeft)}
          </Text>
        </View>
        <Text style={[styles.counterText, { color: colors.textSecondary }]}>
          {answeredCount}/{MOCK_TEST_COUNT}
        </Text>
      </View>

      {/* Question navigator dots */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dotsScroll}
        contentContainerStyle={styles.dotsContainer}>
        {questions.map((_, i) => (
          <Pressable
            key={i}
            onPress={() => setCurrentIndex(i)}
            style={[
              styles.dot,
              {
                backgroundColor:
                  answers[i]
                    ? colors.accent
                    : i === currentIndex
                    ? colors.accentLight
                    : colors.border,
                borderColor: i === currentIndex ? colors.accent : 'transparent',
              },
            ]}>
            <Text
              style={[
                styles.dotText,
                {
                  color: answers[i] ? '#FFFFFF' : i === currentIndex ? colors.accent : colors.textSecondary,
                },
              ]}>
              {i + 1}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Question */}
      <ScrollView contentContainerStyle={styles.questionContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.questionText, { color: colors.text }]}>{currentQuestion.question}</Text>
        <View style={styles.optionsContainer}>
          {OPTION_LABELS.map((label) => {
            const isSelected = answers[currentIndex] === label;
            return (
              <Pressable
                key={label}
                onPress={() => handleSelectAnswer(currentIndex, label)}
                style={[
                  styles.option,
                  {
                    backgroundColor: isSelected ? colors.accentLight : colors.surface,
                    borderColor: isSelected ? colors.accent : colors.border,
                  },
                ]}>
                <View
                  style={[
                    styles.optionLabel,
                    {
                      backgroundColor: isSelected ? colors.accent : colors.border,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.optionLabelText,
                      { color: isSelected ? '#FFFFFF' : colors.text },
                    ]}>
                    {label}
                  </Text>
                </View>
                <Text
                  style={[styles.optionText, { color: colors.text }]}
                  numberOfLines={3}>
                  {currentQuestion.options[label]}
                </Text>
                {isSelected && <MaterialIcons name="check-circle" size={22} color={colors.accent} />}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer nav */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12, backgroundColor: colors.background }]}>
        <View style={styles.footerRow}>
          <Pressable
            onPress={() => setCurrentIndex((p) => Math.max(0, p - 1))}
            disabled={currentIndex === 0}
            style={[
              styles.navButton,
              { backgroundColor: colors.surface, borderColor: colors.border, opacity: currentIndex === 0 ? 0.4 : 1 },
            ]}>
            <MaterialIcons name="arrow-back" size={20} color={colors.text} />
            <Text style={[styles.navButtonText, { color: colors.text }]}>Previous</Text>
          </Pressable>

          {currentIndex === questions.length - 1 ? (
            <Pressable
              onPress={handleFinish}
              style={[styles.navButton, { backgroundColor: colors.accent, borderColor: colors.accent, flex: 1.5 }]}>
              <Text style={[styles.navButtonText, { color: '#FFFFFF' }]}>Submit Test</Text>
              <MaterialIcons name="check" size={20} color="#FFFFFF" />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => setCurrentIndex((p) => Math.min(questions.length - 1, p + 1))}
              style={[styles.navButton, { backgroundColor: colors.accent, borderColor: colors.accent }]}>
              <Text style={[styles.navButtonText, { color: '#FFFFFF' }]}>Next</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 4,
  },
  startContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  startIcon: {
    width: 100,
    height: 100,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  startTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  startSub: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: 16,
    overflow: 'hidden',
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
  },
  infoDivider: {
    width: 1,
  },
  startButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: BorderRadius.lg,
    marginTop: 20,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  quitButton: { padding: 4 },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  counterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dotsScroll: {
    maxHeight: 44,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  dotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  questionContent: {
    padding: 20,
    paddingBottom: 120,
    gap: 16,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    gap: 12,
  },
  optionLabel: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
