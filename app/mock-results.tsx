import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';

const PASS_THRESHOLD = 70;

export default function MockResultsScreen() {
  const params = useLocalSearchParams<{
    correct: string;
    total: string;
    timeUsed: string;
    questionsData: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const correct = parseInt(params.correct || '0', 10);
  const total = parseInt(params.total || '0', 10);
  const timeUsed = parseInt(params.timeUsed || '0', 10);
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = score >= PASS_THRESHOLD;

  const questions = useMemo(() => {
    try {
      return JSON.parse(params.questionsData || '[]');
    } catch {
      return [];
    }
  }, [params.questionsData]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }}>
      {/* Result header */}
      <View style={styles.resultHeader}>
        <View
          style={[
            styles.scoreCircle,
            {
              backgroundColor: passed ? colors.correctBg : colors.wrongBg,
              borderColor: passed ? colors.correct : colors.wrong,
            },
          ]}>
          <Text
            style={[
              styles.scoreText,
              { color: passed ? colors.correct : colors.wrong },
            ]}>
            {score}%
          </Text>
          <Text
            style={[
              styles.scoreLabel,
              { color: passed ? colors.correct : colors.wrong },
            ]}>
            {passed ? 'PASSED' : 'FAILED'}
          </Text>
        </View>

        <Text style={[styles.resultTitle, { color: colors.text }]}>
          {passed ? 'Great job!' : 'Keep practising!'}
        </Text>
        <Text style={[styles.resultSub, { color: colors.textSecondary }]}>
          {passed
            ? 'You passed the mock test. Keep up the good work!'
            : `You need ${PASS_THRESHOLD}% to pass. Review your wrong answers and try again.`}
        </Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialIcons name="check-circle" size={22} color={colors.correct} />
          <Text style={[styles.statValue, { color: colors.text }]}>{correct}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Correct</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialIcons name="cancel" size={22} color={colors.wrong} />
          <Text style={[styles.statValue, { color: colors.text }]}>{total - correct}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Wrong</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialIcons name="timer" size={22} color={colors.accent} />
          <Text style={[styles.statValue, { color: colors.text }]}>{formatTime(timeUsed)}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Time</Text>
        </View>
      </View>

      {/* Question Review */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Review Answers</Text>
      {questions.map((q: any, i: number) => (
        <View
          key={i}
          style={[
            styles.reviewCard,
            {
              backgroundColor: colors.surface,
              borderColor: q.correct ? colors.correct + '40' : colors.wrong + '40',
              borderLeftColor: q.correct ? colors.correct : colors.wrong,
            },
          ]}>
          <View style={styles.reviewHeader}>
            <MaterialIcons
              name={q.correct ? 'check-circle' : 'cancel'}
              size={20}
              color={q.correct ? colors.correct : colors.wrong}
            />
            <Text style={[styles.reviewNum, { color: colors.textSecondary }]}>
              Q{i + 1}
            </Text>
          </View>
          <Text style={[styles.reviewQuestion, { color: colors.text }]} numberOfLines={2}>
            {q.question}
          </Text>
          {!q.correct && (
            <View style={styles.reviewAnswer}>
              {q.selectedAnswer ? (
                <Text style={[styles.reviewAnswerText, { color: colors.wrong }]}>
                  Your answer: {q.selectedAnswer} - {q.options?.[q.selectedAnswer] || ''}
                </Text>
              ) : (
                <Text style={[styles.reviewAnswerText, { color: colors.wrong }]}>Not answered</Text>
              )}
              <Text style={[styles.reviewAnswerText, { color: colors.correct }]}>
                Correct: {q.correctAnswer} - {q.options?.[q.correctAnswer] || ''}
              </Text>
            </View>
          )}
          {q.explanation && !q.correct && (
            <Text style={[styles.reviewExplanation, { color: colors.textSecondary }]}>
              {q.explanation}
            </Text>
          )}
        </View>
      ))}

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable
          onPress={() => router.replace('/mock-test')}
          style={[styles.actionButton, { backgroundColor: colors.accent }]}>
          <MaterialIcons name="replay" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Retake Test</Text>
        </Pressable>
        <Pressable
          onPress={() => router.replace('/(tabs)')}
          style={[styles.actionButtonOutline, { borderColor: colors.border }]}>
          <MaterialIcons name="home" size={20} color={colors.text} />
          <Text style={[styles.actionButtonOutlineText, { color: colors.text }]}>Back to Home</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  resultHeader: {
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 8,
    marginBottom: 24,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  resultSub: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  reviewCard: {
    marginHorizontal: 20,
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderLeftWidth: 4,
    gap: 6,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reviewNum: {
    fontSize: 13,
    fontWeight: '600',
  },
  reviewQuestion: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  reviewAnswer: {
    gap: 2,
  },
  reviewAnswerText: {
    fontSize: 13,
    lineHeight: 18,
  },
  reviewExplanation: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
    marginTop: 2,
  },
  actions: {
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 8,
  },
  actionButtonOutlineText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
