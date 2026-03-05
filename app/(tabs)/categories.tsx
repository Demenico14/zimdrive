import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import { CATEGORY_META, getAllCategories, getQuestionsByCategory, type Category } from '@/data/questions';
import { useCallback, useState } from 'react';
import { getCategoryStats, type CategoryStats } from '@/lib/storage';
import { useFocusEffect } from '@react-navigation/native';

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const categories = getAllCategories();
  const [stats, setStats] = useState<CategoryStats[]>([]);

  useFocusEffect(
    useCallback(() => {
      getCategoryStats().then(setStats);
    }, [])
  );

  const getStatForCategory = (cat: string) =>
    stats.find((s) => s.category === cat);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }}>
      <Text style={[styles.title, { color: colors.text }]}>Practice by Topic</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Choose a category to start practicing
      </Text>

      <View style={styles.grid}>
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat];
          const questionCount = getQuestionsByCategory(cat).length;
          const catStat = getStatForCategory(cat);

          return (
            <Pressable
              key={cat}
              onPress={() => router.push(`/practice/${cat}` as any)}
              style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}>
              <View style={[styles.iconCircle, { backgroundColor: meta.color + '15' }]}>
                <MaterialIcons name={meta.icon as any} size={28} color={meta.color} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{meta.label}</Text>
              <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
                {questionCount} questions
              </Text>
              {catStat && catStat.total > 0 && (
                <View style={styles.statRow}>
                  <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${catStat.accuracy}%`,
                          backgroundColor:
                            catStat.accuracy >= 70
                              ? colors.correct
                              : catStat.accuracy >= 40
                              ? colors.warning
                              : colors.wrong,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.statText, { color: colors.textSecondary }]}>
                    {catStat.accuracy}%
                  </Text>
                </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    gap: 12,
  },
  card: {
    width: '47%',
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 8,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  cardSub: {
    fontSize: 13,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  progressBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
