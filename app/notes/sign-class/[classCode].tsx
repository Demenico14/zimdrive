import { useState, useRef, useCallback, useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import type { ViewToken } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import { ROAD_SIGNS_CATEGORIES, type RoadSign } from '@/data/notes-content';
import { getSignImage } from '@/data/sign-images';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HORIZONTAL_PADDING = 20;
const CARD_GAP = 12;
const CARD_WIDTH = SCREEN_WIDTH - CARD_HORIZONTAL_PADDING * 2;

/* ── Subgroup colour map ─────────────────────────────────── */

const SUBGROUP_COLORS: Record<string, { accent: string; label: string }> = {
  'Prohibitory Signs':  { accent: '#DC2626', label: 'Prohibitory' },
  'Command Signs':      { accent: '#2563EB', label: 'Command' },
  'Reservation Signs':  { accent: '#0284C7', label: 'Reservation' },
  'Guidance Signs':     { accent: '#047857', label: 'Guidance' },
  'Tourism Signs':      { accent: '#92400E', label: 'Tourism' },
};

/* ── Main detail screen ──────────────────────────────────── */

export default function SignClassDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { classCode } = useLocalSearchParams<{ classCode: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const category = useMemo(
    () => ROAD_SIGNS_CATEGORIES.find((c) => c.classCode === classCode) ?? null,
    [classCode],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const goTo = useCallback(
    (index: number) => {
      if (category && index >= 0 && index < category.signs.length) {
        flatListRef.current?.scrollToIndex({ index, animated: true });
      }
    },
    [category],
  );

  if (!category) {
    return (
      <View style={[s.screen, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text, fontSize: 16 }}>Class not found</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.tint, fontSize: 15, fontWeight: '600' }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const accent = category.shapeColor;
  const signs = category.signs;

  return (
    <View style={[s.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 8, backgroundColor: colors.background }]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={[s.backBtn, { backgroundColor: colors.surface }]}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <View style={s.headerCenter}>
          <Text style={[s.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {category.title}
          </Text>
          <Text style={[s.headerSub, { color: accent, fontWeight: '600' }]}>
            {category.classCode}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Banner */}
      <View style={[s.banner, { backgroundColor: accent }]}>
        <View style={s.bannerIconWrap}>
          <MaterialIcons name="info-outline" size={26} color="rgba(255,255,255,0.95)" />
        </View>
        <View style={s.bannerText}>
          <Text style={s.bannerTitle}>{category.title}</Text>
          <Text style={s.bannerSubtitle}>
            Swipe through {signs.length} signs to study each one
          </Text>
        </View>
      </View>

      {/* Card deck */}
      <View style={s.deckContainer}>
        <FlatList
          ref={flatListRef}
          data={signs}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          keyExtractor={(_, i) => `sign-${i}`}
          contentContainerStyle={{ paddingHorizontal: CARD_HORIZONTAL_PADDING }}
          snapToInterval={CARD_WIDTH + CARD_GAP}
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: CARD_WIDTH + CARD_GAP,
            offset: (CARD_WIDTH + CARD_GAP) * index,
            index,
          })}
          renderItem={({ item, index }) => {
            const sgInfo = item.subgroup ? SUBGROUP_COLORS[item.subgroup] : null;
            const cardAccent = sgInfo ? sgInfo.accent : accent;
            const imageSource = getSignImage(item.image);

            return (
              <View
                style={[
                  s.swipeCard,
                  {
                    width: CARD_WIDTH,
                    marginRight: index < signs.length - 1 ? CARD_GAP : 0,
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    borderColor: isDark ? '#374151' : '#E5E7EB',
                  },
                ]}>
                {/* Top color bar */}
                <View style={[s.cardTopBar, { backgroundColor: cardAccent }]} />

                {/* Image area */}
                {imageSource ? (
                  <View style={[s.imageContainer, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
                    <Image
                      source={imageSource}
                      style={s.signImage}
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <View style={[s.imagePlaceholder, { backgroundColor: cardAccent + '0C' }]}>
                    <MaterialIcons name="image" size={48} color={cardAccent + '40'} />
                    <Text style={[s.placeholderText, { color: cardAccent + '60' }]}>
                      Image coming soon
                    </Text>
                  </View>
                )}

                {/* Badges row */}
                <View style={s.cardBadgeRow}>
                  {item.subgroup && sgInfo && (
                    <View style={[s.subgroupBadge, { backgroundColor: sgInfo.accent + '18' }]}>
                      <Text style={[s.subgroupBadgeText, { color: sgInfo.accent }]}>
                        {sgInfo.label}
                      </Text>
                    </View>
                  )}
                  <View style={[s.numberBadge, { backgroundColor: cardAccent }]}>
                    <Text style={s.numberBadgeText}>{index + 1}</Text>
                  </View>
                </View>

                {/* Sign name */}
                <Text style={[s.cardSignName, { color: colors.text }]}>
                  {item.name}
                </Text>

                {/* Meaning */}
                <Text style={[s.cardMeaning, { color: colors.textSecondary }]}>
                  {item.meaning}
                </Text>

                {/* Tip box */}
                <View style={[s.tipBox, { backgroundColor: cardAccent + '0C' }]}>
                  <MaterialIcons name="lightbulb-outline" size={16} color={cardAccent} />
                  <Text style={[s.tipText, { color: colors.textSecondary }]}>
                    Remember this sign for your test
                  </Text>
                </View>
              </View>
            );
          }}
        />
      </View>

      {/* Navigation row */}
      <View style={s.navRow}>
        <Pressable
          onPress={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          style={[
            s.navBtn,
            {
              backgroundColor:
                activeIndex === 0
                  ? isDark ? '#374151' : '#E5E7EB'
                  : accent,
              opacity: activeIndex === 0 ? 0.4 : 1,
            },
          ]}>
          <MaterialIcons
            name="chevron-left"
            size={22}
            color={activeIndex === 0 ? colors.textSecondary : '#FFFFFF'}
          />
        </Pressable>

        <Text style={[s.navCounter, { color: colors.textSecondary }]}>
          {activeIndex + 1} / {signs.length}
        </Text>

        <Pressable
          onPress={() => goTo(activeIndex + 1)}
          disabled={activeIndex === signs.length - 1}
          style={[
            s.navBtn,
            {
              backgroundColor:
                activeIndex === signs.length - 1
                  ? isDark ? '#374151' : '#E5E7EB'
                  : accent,
              opacity: activeIndex === signs.length - 1 ? 0.4 : 1,
            },
          ]}>
          <MaterialIcons
            name="chevron-right"
            size={22}
            color={activeIndex === signs.length - 1 ? colors.textSecondary : '#FFFFFF'}
          />
        </Pressable>
      </View>

      {/* Dot indicators */}
      <View style={[s.dotsRow, { paddingBottom: insets.bottom + 16 }]}>
        {signs.length <= 20 ? (
          signs.map((_, i) => (
            <View
              key={i}
              style={[
                s.dot,
                {
                  backgroundColor:
                    i === activeIndex ? accent : isDark ? '#374151' : '#D1D5DB',
                  width: i === activeIndex ? 18 : 6,
                },
              ]}
            />
          ))
        ) : (
          <Text style={[s.navCounter, { color: colors.textSecondary, fontSize: 12 }]}>
            Card {activeIndex + 1} of {signs.length}
          </Text>
        )}
      </View>
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

  /* Banner */
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: BorderRadius.lg,
    gap: 14,
    marginBottom: 16,
  },
  bannerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: { flex: 1 },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 3,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    lineHeight: 17,
  },

  /* Card Deck */
  deckContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  swipeCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    paddingBottom: 16,
    justifyContent: 'flex-start',
  },
  cardTopBar: {
    height: 5,
    width: '100%',
  },

  /* Image */
  imageContainer: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  signImage: {
    width: 130,
    height: 130,
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  placeholderText: {
    fontSize: 12,
    fontWeight: '500',
  },

  /* Card content */
  cardBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 8,
  },
  subgroupBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  subgroupBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  numberBadge: {
    minWidth: 24,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
  },
  numberBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  cardSignName: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  cardMeaning: {
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    gap: 8,
  },
  tipText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },

  /* Navigation */
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 14,
    gap: 24,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navCounter: {
    fontSize: 15,
    fontWeight: '600',
    minWidth: 60,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    gap: 4,
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
