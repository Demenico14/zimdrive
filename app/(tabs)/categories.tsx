import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import { CATEGORY_META, getAllCategories, getQuestionsByCategory, type Category } from '@/data/questions';
import { useCallback, useState } from 'react';
import { getCategoryStats, type CategoryStats } from '@/lib/storage';
import { getAllLevelProgress, type CategoryLevelProgress, LEVEL_CONFIG, DIFFICULTY_CONFIG } from '@/lib/levels';
import { useFocusEffect } from '@react-navigation/native';

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const categories = getAllCategories();
  const [stats, setStats] = useState<CategoryStats[]>([]);
  const [levelProgress, setLevelProgress] = useState<Record<string, CategoryLevelProgress>>({});

  useFocusEffect(
    useCallback(() => {
      getCategoryStats().then(setStats);
      getAllLevelProgress().then(setLevelProgress);
    }, [])
  );

  const getStatForCategory = (cat: string) =>
    stats.find((s) => s.category === cat);

  const getLevelProgressForCategory = (cat: string) => {
    const progress = levelProgress[cat];
    if (!progress) return { completed: 0, total: LEVEL_CONFIG.length };
    return { 
      completed: progress.completedLevels.length, 
      total: LEVEL_CONFIG.length 
    };
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }}>
      <Text style={[styles.title, { color: colors.text }]}>Practice by Topic</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Complete levels to master each category
      </Text>

      <View style={styles.categoryList}>
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat];
          const questionCount = getQuestionsByCategory(cat).length;
          const catStat = getStatForCategory(cat);
          const { completed, total } = getLevelProgressForCategory(cat);
          const progressPercent = (completed / total) * 100;
          const isComplete = completed === total;

          return (
            <Pressable
              key={cat}
              onPress={() => router.push(`/practice/levels/${cat}` as any)}
              style={[
                styles.card,
                { 
                  backgroundColor: colors.surface, 
                  borderColor: isComplete ? meta.color : colors.border,
                  borderWidth: isComplete ? 2 : 1,
                },
              ]}>
              <View style={styles.cardContent}>
                {/* Icon */}
                <View style={[styles.iconCircle, { backgroundColor: meta.color + '15' }]}>
                  <MaterialIcons name={meta.icon as any} size={28} color={meta.color} />
                  {isComplete && (
                    <View style={[styles.completeBadge, { backgroundColor: meta.color }]}>
                      <MaterialIcons name="check" size={12} color="#FFFFFF" />
                    </View>
                  )}
                </View>

                {/* Info */}
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{meta.label}</Text>
                  <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
                    {questionCount} questions
                  </Text>

                  {/* Difficulty tier progress */}
                  <View style={styles.levelProgressRow}>
                    <View style={styles.tierRow}>
                      <View 
                        style={[
                          styles.tierDot, 
                          { backgroundColor: completed >= 3 ? DIFFICULTY_CONFIG.easy.color : colors.border }
                        ]} 
                      />
                      <View 
                        style={[
                          styles.tierDot, 
                          { backgroundColor: completed >= 6 ? DIFFICULTY_CONFIG.medium.color : colors.border }
                        ]} 
                      />
                      <View 
                        style={[
                          styles.tierDot, 
                          { backgroundColor: completed >= 9 ? DIFFICULTY_CONFIG.hard.color : colors.border }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.levelText, { color: colors.textSecondary }]}>
                      {completed}/{total} levels
                    </Text>
                  </View>

                  {/* Progress bar */}
                  <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${progressPercent}%`,
                          backgroundColor: meta.color,
                        },
                      ]}
                    />
                  </View>
                </View>

                {/* Chevron */}
                <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Free play section */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Free Practice</Text>
      <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
        Practice without level progression
      </Text>

      <View style={styles.freePlayGrid}>
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat];
          const catStat = getStatForCategory(cat);

          return (
            <Pressable
              key={cat}
              onPress={() => router.push(`/practice/${cat}` as any)}
              style={[
                styles.freePlayCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}>
              <View style={[styles.freePlayIcon, { backgroundColor: meta.color + '15' }]}>
                <MaterialIcons name={meta.icon as any} size={22} color={meta.color} />
              </View>
              <Text style={[styles.freePlayTitle, { color: colors.text }]} numberOfLines={1}>
                {meta.label}
              </Text>
              {catStat && catStat.total > 0 && (
                <Text style={[styles.freePlayAccuracy, { color: meta.color }]}>
                  {catStat.accuracy}%
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 32,
  },
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  completeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSub: {
    fontSize: 13,
  },
  levelProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  tierRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tierDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressBg: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  freePlayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    gap: 10,
  },
  freePlayCard: {
    width: '31%',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  freePlayIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  freePlayTitle: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  freePlayAccuracy: {
    fontSize: 12,
    fontWeight: '700',
  },
});
