import { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import { ROAD_SIGNS_CATEGORIES, type RoadSignCategory } from '@/data/notes-content';

/* ── Visual shape badge ───────────────────────────────────── */

function SignShapeBadge({ category, size = 36 }: { category: RoadSignCategory; size?: number }) {
  const { shape, shapeColor, shapeFill } = category;

  if (shape === 'triangle') {
    return (
      <View style={[badgeS.container, { width: size, height: size }]}>
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: size / 2,
            borderRightWidth: size / 2,
            borderBottomWidth: size - 4,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: shapeColor,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 6,
            width: 0,
            height: 0,
            borderLeftWidth: (size / 2) - 5,
            borderRightWidth: (size / 2) - 5,
            borderBottomWidth: size - 14,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: shapeFill,
          }}
        />
      </View>
    );
  }

  if (shape === 'rectangle') {
    return (
      <View
        style={[
          badgeS.container,
          {
            width: size + 6,
            height: size - 6,
            backgroundColor: shapeFill,
            borderRadius: 5,
            borderWidth: 2,
            borderColor: shapeColor,
          },
        ]}
      />
    );
  }

  if (shape === 'circle-slash') {
    return (
      <View
        style={[
          badgeS.container,
          {
            width: size,
            height: size,
            backgroundColor: shapeFill,
            borderRadius: size / 2,
            borderWidth: 3.5,
            borderColor: shapeColor,
          },
        ]}>
        <View
          style={{
            position: 'absolute',
            width: size - 7,
            height: 3,
            backgroundColor: shapeColor,
            borderRadius: 2,
            transform: [{ rotate: '-45deg' }],
          }}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        badgeS.container,
        {
          width: size,
          height: size,
          backgroundColor: shapeFill,
          borderRadius: size / 2,
          borderWidth: 3.5,
          borderColor: shapeColor,
        },
      ]}
    />
  );
}

const badgeS = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
});

/* ── Section card ─────────────────────────────────────────── */

function SectionCard({
  category,
  index,
  isDark,
  surfaceColor,
  textColor,
  textSecondaryColor,
  borderColor,
  onPress,
}: {
  category: RoadSignCategory;
  index: number;
  isDark: boolean;
  surfaceColor: string;
  textColor: string;
  textSecondaryColor: string;
  borderColor: string;
  onPress: () => void;
}) {
  const accent = category.shapeColor;
  const subgroupNames =
    category.subgroups && category.subgroups.length > 0
      ? category.subgroups.map((sg) => sg.name)
      : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        cardS.card,
        {
          backgroundColor: surfaceColor,
          borderColor,
          borderLeftColor: accent,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}>
      {/* Top row */}
      <View style={cardS.topRow}>
        <View style={[cardS.badgeWrap, { backgroundColor: accent + (isDark ? '14' : '08') }]}>
          <SignShapeBadge category={category} size={34} />
        </View>

        <View style={cardS.meta}>
          <View style={cardS.tagRow}>
            <View style={[cardS.classTag, { backgroundColor: accent + '1A' }]}>
              <Text style={[cardS.classTagText, { color: accent }]}>{category.classCode}</Text>
            </View>
            <Text style={[cardS.countText, { color: textSecondaryColor }]}>
              {category.signs.length} sign{category.signs.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <Text style={[cardS.title, { color: textColor }]} numberOfLines={1}>
            {category.title}
          </Text>
        </View>

        <View style={[cardS.arrow, { backgroundColor: accent + (isDark ? '20' : '10') }]}>
          <MaterialIcons name="chevron-right" size={22} color={accent} />
        </View>
      </View>

      {/* Description */}
      <Text style={[cardS.desc, { color: textSecondaryColor }]} numberOfLines={2}>
        {category.description}
      </Text>

      {/* Subgroup chips */}
      {subgroupNames && (
        <View style={cardS.subgroupRow}>
          {category.subgroups!.map((sg) => (
            <View
              key={sg.name}
              style={[cardS.subgroupChip, { backgroundColor: isDark ? accent + '14' : accent + '0C' }]}>
              <View style={[cardS.subgroupDot, { backgroundColor: accent }]} />
              <Text style={[cardS.subgroupText, { color: accent }]} numberOfLines={1}>
                {sg.name}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}

const cardS = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderLeftWidth: 5,
    padding: 16,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badgeWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meta: {
    flex: 1,
    gap: 3,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  classTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  classTagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
  },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desc: {
    fontSize: 13,
    lineHeight: 18,
    paddingLeft: 2,
  },
  subgroupRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 2,
  },
  subgroupChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subgroupDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  subgroupText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

/* ── Main screen ──────────────────────────────────────────── */

export default function RoadSignsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const totalSigns = useMemo(
    () => ROAD_SIGNS_CATEGORIES.reduce((sum, cat) => sum + cat.signs.length, 0),
    [],
  );

  return (
    <View style={[s.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 8, backgroundColor: colors.background }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={[s.backBtn, { backgroundColor: colors.surface }]}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <View style={s.headerCenter}>
          <Text style={[s.headerTitle, { color: colors.text }]}>Road Signs</Text>
          <Text style={[s.headerSub, { color: colors.textSecondary }]}>
            {totalSigns} signs across {ROAD_SIGNS_CATEGORIES.length} classes
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}>

        {/* Hero banner */}
        <View style={s.heroBanner}>
          <View style={s.heroLeft}>
            <Text style={s.heroTitle}>{'Zimbabwe\nRoad Signs'}</Text>
            <Text style={s.heroSub}>Class A through E</Text>
          </View>
          <View style={s.heroShapes}>
            <View style={[s.miniTriangle, { borderBottomColor: '#FCD34D' }]} />
            <View style={[s.miniCircle, { backgroundColor: '#FFF', borderColor: '#DC2626' }]} />
            <View style={[s.miniRect, { backgroundColor: '#047857' }]} />
          </View>
        </View>

        {/* Section cards */}
        <View style={s.cardList}>
          {ROAD_SIGNS_CATEGORIES.map((category, idx) => (
            <SectionCard
              key={idx}
              category={category}
              index={idx}
              isDark={isDark}
              surfaceColor={colors.surface}
              textColor={colors.text}
              textSecondaryColor={colors.textSecondary}
              borderColor={colors.border}
              onPress={() => {
                router.push({
                  pathname: '/notes/sign-class/[classCode]',
                  params: { classCode: category.classCode },
                });
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* ── Styles ────────────────────────────────────────────────── */

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
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerSub: { fontSize: 12, marginTop: 1 },

  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1F2937',
    borderRadius: BorderRadius.lg,
    padding: 22,
    marginBottom: 18,
  },
  heroLeft: { flex: 1 },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 6,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '500',
  },
  heroShapes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderBottomWidth: 28,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  miniCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
  },
  miniRect: {
    width: 36,
    height: 24,
    borderRadius: 4,
  },

  cardList: {
    gap: 14,
  },
});
