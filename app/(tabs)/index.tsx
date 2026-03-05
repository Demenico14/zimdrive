import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useApp } from '@/contexts/app-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { CATEGORY_META, type Category, QUESTIONS } from '@/data/questions';
import { FREE_DAILY_LIMIT } from '@/lib/storage';
import { QuotaBadge } from '@/components/quota-badge';
import { useCallback, useEffect, useState } from 'react';
import { getCategoryStats, type CategoryStats, getWrongAttempts } from '@/lib/storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { overallStats, purchased, remainingQuestions, refreshStats } = useApp();
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [wrongCount, setWrongCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      refreshStats();
      getCategoryStats().then(setCategoryStats);
      getWrongAttempts().then((w) => setWrongCount(w.length));
    }, [refreshStats])
  );

  const weakCategories = categoryStats
    .filter((s) => s.accuracy < 70 && s.total >= 3)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 2);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back</Text>
          <Text style={[styles.title, { color: colors.text }]}>ZimDrive</Text>
        </View>
        <QuotaBadge />
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialIcons name="check-circle" size={24} color={colors.correct} />
          <Text style={[styles.statNumber, { color: colors.text }]}>{overallStats.totalCorrect}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Correct</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialIcons name="percent" size={24} color={colors.accent} />
          <Text style={[styles.statNumber, { color: colors.text }]}>{overallStats.accuracy}%</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Accuracy</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MaterialIcons name="local-fire-department" size={24} color={colors.warning} />
          <Text style={[styles.statNumber, { color: colors.text }]}>{overallStats.streak}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Streak</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Start</Text>
      <View style={styles.actionRow}>
        <Pressable
          onPress={() => router.push('/mock-test')}
          style={[styles.actionCard, { backgroundColor: colors.accent }]}>
          <MaterialIcons name="timer" size={28} color="#FFFFFF" />
          <Text style={styles.actionTitle}>Mock Test</Text>
          <Text style={styles.actionSub}>Timed exam simulation</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/review')}
          style={[styles.actionCard, { backgroundColor: colorScheme === 'dark' ? '#7F1D1D' : '#DC2626' }]}>
          <MaterialIcons name="replay" size={28} color="#FFFFFF" />
          <Text style={styles.actionTitle}>Review</Text>
          <Text style={styles.actionSub}>
            {wrongCount > 0 ? `${wrongCount} wrong answers` : 'No mistakes yet'}
          </Text>
        </Pressable>
      </View>

      {/* Weak Categories */}
      {weakCategories.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Needs Improvement</Text>
          {weakCategories.map((stat) => {
            const meta = CATEGORY_META[stat.category as Category];
            if (!meta) return null;
            return (
              <Pressable
                key={stat.category}
                onPress={() => router.push(`/practice/${stat.category}` as any)}
                style={[styles.weakCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.weakIcon, { backgroundColor: meta.color + '15' }]}>
                  <MaterialIcons name={meta.icon as any} size={22} color={meta.color} />
                </View>
                <View style={styles.weakInfo}>
                  <Text style={[styles.weakTitle, { color: colors.text }]}>{meta.label}</Text>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${stat.accuracy}%`,
                          backgroundColor: stat.accuracy < 50 ? colors.wrong : colors.warning,
                        },
                      ]}
                    />
                  </View>
                </View>
                <Text style={[styles.weakPercent, { color: stat.accuracy < 50 ? colors.wrong : colors.warning }]}>
                  {stat.accuracy}%
                </Text>
              </Pressable>
            );
          })}
        </>
      )}

      {/* Total Progress */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Progress</Text>
      <View style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.progressRow}>
          <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Questions answered</Text>
          <Text style={[styles.progressValue, { color: colors.text }]}>
            {overallStats.totalAnswered} / {QUESTIONS.length}
          </Text>
        </View>
        <View style={[styles.progressBarBgFull, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressBarFillFull,
              {
                width: `${Math.min(100, (overallStats.totalAnswered / QUESTIONS.length) * 100)}%`,
                backgroundColor: colors.accent,
              },
            ]}
          />
        </View>
      </View>

      {!purchased && (
        <Pressable
          onPress={() => router.push('/paywall')}
          style={[styles.upgradeCard, { backgroundColor: colors.accentLight, borderColor: colors.accent + '40' }]}>
          <MaterialIcons name="lock-open" size={24} color={colors.accent} />
          <View style={styles.upgradeInfo}>
            <Text style={[styles.upgradeTitle, { color: colors.accent }]}>Unlock All Questions</Text>
            <Text style={[styles.upgradeSub, { color: colors.textSecondary }]}>
              Lifetime access for just $4 USD
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={colors.accent} />
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: { fontSize: 14, marginBottom: 2 },
  title: { fontSize: 28, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  statNumber: { fontSize: 22, fontWeight: '700' },
  statLabel: { fontSize: 12 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  actionTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
  actionSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  weakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 12,
    marginBottom: 8,
  },
  weakIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weakInfo: { flex: 1, gap: 6 },
  weakTitle: { fontSize: 15, fontWeight: '500' },
  weakPercent: { fontSize: 16, fontWeight: '700' },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressCard: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 10,
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: { fontSize: 14 },
  progressValue: { fontSize: 14, fontWeight: '600' },
  progressBarBgFull: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFillFull: {
    height: '100%',
    borderRadius: 4,
  },
  upgradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 12,
  },
  upgradeInfo: { flex: 1, gap: 2 },
  upgradeTitle: { fontSize: 15, fontWeight: '600' },
  upgradeSub: { fontSize: 13 },
});
