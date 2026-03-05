import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import { HIGHWAY_CODE_SECTIONS } from '@/data/notes-content';

const SECTION_COLORS = [
  '#2563EB',
  '#7C3AED',
  '#0891B2',
  '#DC2626',
  '#EA580C',
  '#0E8A3E',
  '#BE185D',
  '#4F46E5',
  '#0D9488',
];

export default function HighwayCodeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const openSection = (index: number, accentColor: string) => {
    router.push({
      pathname: '/notes/section-detail',
      params: {
        source: 'highway-code',
        sectionIndex: index.toString(),
        accentColor,
      },
    });
  };

  return (
    <View style={[s.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          s.header,
          { paddingTop: insets.top + 8, backgroundColor: colors.background },
        ]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={[s.backBtn, { backgroundColor: colors.surface }]}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <View style={s.headerCenter}>
          <Text style={[s.headerTitle, { color: colors.text }]}>Highway Code</Text>
          <Text style={[s.headerSub, { color: colors.textSecondary }]}>
            {HIGHWAY_CODE_SECTIONS.length} sections
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}>
        {/* Top banner */}
        <View style={[s.banner, { backgroundColor: '#2563EB' }]}>
          <MaterialIcons
            name="menu-book"
            size={32}
            color="rgba(255,255,255,0.9)"
          />
          <View style={s.bannerText}>
            <Text style={s.bannerTitle}>Highway Code</Text>
            <Text style={s.bannerSub}>
              Tap a section to study its notes one at a time
            </Text>
          </View>
        </View>

        {/* Sections list */}
        {HIGHWAY_CODE_SECTIONS.map((section, idx) => {
          const accentColor = SECTION_COLORS[idx % SECTION_COLORS.length];

          return (
            <Pressable
              key={idx}
              onPress={() => openSection(idx, accentColor)}
              style={({ pressed }) => [
                s.sectionRow,
                {
                  backgroundColor: pressed
                    ? isDark
                      ? '#374151'
                      : '#F3F4F6'
                    : colors.surface,
                  borderColor: colors.border,
                },
              ]}>
              <View
                style={[
                  s.sectionBadge,
                  { backgroundColor: accentColor + '18' },
                ]}>
                <MaterialIcons
                  name={section.icon as any}
                  size={20}
                  color={accentColor}
                />
              </View>
              <View style={s.sectionInfo}>
                <Text style={[s.sectionTitle, { color: colors.text }]}>
                  {section.title}
                </Text>
                <Text style={[s.sectionCount, { color: colors.textSecondary }]}>
                  {section.content.length}{' '}
                  {section.content.length === 1 ? 'note' : 'notes'}
                </Text>
              </View>
              <View
                style={[
                  s.arrowCircle,
                  { backgroundColor: accentColor + '14' },
                ]}>
                <MaterialIcons
                  name="chevron-right"
                  size={22}
                  color={accentColor}
                />
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSub: {
    fontSize: 12,
    marginTop: 1,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: BorderRadius.lg,
    gap: 16,
    marginBottom: 20,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    lineHeight: 18,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 12,
    marginBottom: 10,
  },
  sectionBadge: {
    width: 44,
    height: 44,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionInfo: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionCount: {
    fontSize: 12,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
