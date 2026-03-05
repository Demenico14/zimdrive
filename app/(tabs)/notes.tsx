import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import { NOTES_SECTIONS } from '@/data/notes-content';

const CARD_ACCENTS: Record<string, { bg: string; gradient: string }> = {
  'highway-code': { bg: '#2563EB', gradient: '#1D4ED8' },
  'road-rules': { bg: '#0E8A3E', gradient: '#047857' },
  'road-signs': { bg: '#DC2626', gradient: '#B91C1C' },
};

export default function NotesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 100,
      }}>
      <Text style={[styles.title, { color: colors.text }]}>Study Notes</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Reference material for your theory test
      </Text>

      {/* Tip card */}
      <View style={[styles.tipCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.tipIcon, { backgroundColor: colors.warningBg }]}>
          <MaterialIcons name="lightbulb" size={20} color={colors.warning} />
        </View>
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
          Tap a section to start reading. Each note is numbered for easy reference.
        </Text>
      </View>

      <View style={styles.list}>
        {NOTES_SECTIONS.map((section) => {
          const accent = CARD_ACCENTS[section.key] || { bg: '#6B7280', gradient: '#4B5563' };
          return (
            <Pressable
              key={section.key}
              onPress={() => router.push(`/notes/${section.key}` as any)}
              style={({ pressed }) => [
                styles.card,
                { opacity: pressed ? 0.9 : 1 },
              ]}>
              {/* Colored top strip */}
              <View style={[styles.cardTop, { backgroundColor: accent.bg }]}>
                <MaterialIcons name={section.icon as any} size={32} color="rgba(255,255,255,0.9)" />
                <View style={styles.cardTopText}>
                  <Text style={styles.cardTitle}>{section.title}</Text>
                  <Text style={styles.cardCount}>
                    {section.itemCount} {section.itemCount === 1 ? 'section' : 'sections'}
                  </Text>
                </View>
                <MaterialIcons name="arrow-forward" size={22} color="rgba(255,255,255,0.7)" />
              </View>
              {/* Description area */}
              <View style={[styles.cardBottom, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                  {section.description}
                </Text>
              </View>
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
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 12,
    marginBottom: 20,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  list: {
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 14,
  },
  cardTopText: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardCount: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '500',
  },
  cardBottom: {
    padding: 14,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 19,
  },
});
