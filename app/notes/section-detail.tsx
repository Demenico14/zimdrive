import { useState, useRef, useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
} from 'react-native';
import type { ViewToken } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import { HIGHWAY_CODE_SECTIONS, ROAD_RULES_SECTIONS } from '@/data/notes-content';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HORIZONTAL_PADDING = 20;
const CARD_GAP = 12;
const CARD_WIDTH = SCREEN_WIDTH - CARD_HORIZONTAL_PADDING * 2;

const CATEGORY_ICONS: Record<string, string> = {
  warning: 'warning',
  mandatory: 'verified',
  info: 'info',
  prohibition: 'block',
};

function getCardType(text: string): 'warning' | 'mandatory' | 'info' | 'prohibition' {
  const lower = text.toLowerCase();
  if (
    lower.includes('do not') ||
    lower.includes('never') ||
    lower.includes('prohibited') ||
    lower.includes('offence') ||
    lower.includes('should not') ||
    lower.includes('not ')
  )
    return 'prohibition';
  if (
    lower.includes('must') ||
    lower.includes('always') ||
    lower.includes('required') ||
    lower.includes('compulsory') ||
    lower.includes('stop')
  )
    return 'mandatory';
  if (
    lower.includes('danger') ||
    lower.includes('caution') ||
    lower.includes('penalty') ||
    lower.includes('fine') ||
    lower.includes('warning')
  )
    return 'warning';
  return 'info';
}

const CARD_TYPE_COLORS = {
  warning: '#F59E0B',
  mandatory: '#2563EB',
  info: '#0891B2',
  prohibition: '#DC2626',
};

const CARD_TYPE_LABELS = {
  warning: 'Warning',
  mandatory: 'Mandatory',
  info: 'Info',
  prohibition: 'Prohibition',
};

export default function SectionDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const { source, sectionIndex, accentColor } = useLocalSearchParams<{
    source: string;
    sectionIndex: string;
    accentColor: string;
  }>();

  const sections = source === 'road-rules' ? ROAD_RULES_SECTIONS : HIGHWAY_CODE_SECTIONS;
  const idx = parseInt(sectionIndex ?? '0', 10);
  const section = sections[idx];

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

  const goTo = (index: number) => {
    if (index >= 0 && index < section.content.length) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }
  };

  if (!section) {
    return (
      <View style={[s.screen, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text, fontSize: 16 }}>Section not found</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.tint, fontSize: 15, fontWeight: '600' }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const accent = accentColor ?? '#0E8A3E';

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
            {section.title}
          </Text>
          <Text style={[s.headerSub, { color: colors.textSecondary }]}>
            {section.content.length} {section.content.length === 1 ? 'note' : 'notes'}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Section icon + title banner */}
      <View style={[s.banner, { backgroundColor: accent }]}>
        <View style={s.bannerIconWrap}>
          <MaterialIcons name={section.icon as any} size={28} color="rgba(255,255,255,0.95)" />
        </View>
        <View style={s.bannerText}>
          <Text style={s.bannerTitle}>{section.title}</Text>
          <Text style={s.bannerSub}>
            Swipe through the cards below to study each note
          </Text>
        </View>
      </View>

      {/* Card deck */}
      <View style={s.deckContainer}>
        <FlatList
          ref={flatListRef}
          data={section.content}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          keyExtractor={(_, i) => `card-${i}`}
          contentContainerStyle={{ paddingHorizontal: CARD_HORIZONTAL_PADDING }}
          snapToInterval={CARD_WIDTH + CARD_GAP}
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: CARD_WIDTH + CARD_GAP,
            offset: (CARD_WIDTH + CARD_GAP) * index,
            index,
          })}
          renderItem={({ item, index }) => {
            const cardType = getCardType(item);
            const typeColor = CARD_TYPE_COLORS[cardType];

            return (
              <View
                style={[
                  s.swipeCard,
                  {
                    width: CARD_WIDTH,
                    marginRight: index < section.content.length - 1 ? CARD_GAP : 0,
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    borderColor: isDark ? '#374151' : '#E5E7EB',
                  },
                ]}>
                {/* Top color bar */}
                <View style={[s.cardTopBar, { backgroundColor: accent }]} />

                {/* Card type badge */}
                <View style={s.cardBadgeRow}>
                  <View style={[s.cardTypeBadge, { backgroundColor: typeColor + '18' }]}>
                    <MaterialIcons
                      name={CATEGORY_ICONS[cardType] as any}
                      size={14}
                      color={typeColor}
                    />
                    <Text style={[s.cardTypeBadgeText, { color: typeColor }]}>
                      {CARD_TYPE_LABELS[cardType]}
                    </Text>
                  </View>
                </View>

                {/* Rule number */}
                <Text style={[s.cardRuleNumber, { color: accent }]}>
                  Note {index + 1}
                </Text>

                {/* Rule content */}
                <Text style={[s.cardContent, { color: colors.text }]}>{item}</Text>

                {/* Tip box */}
                <View style={[s.tipBox, { backgroundColor: accent + '0C' }]}>
                  <MaterialIcons name="lightbulb-outline" size={16} color={accent} />
                  <Text style={[s.tipText, { color: colors.textSecondary }]}>
                    Remember this for your test
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
                  ? isDark
                    ? '#374151'
                    : '#E5E7EB'
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
          {activeIndex + 1} / {section.content.length}
        </Text>

        <Pressable
          onPress={() => goTo(activeIndex + 1)}
          disabled={activeIndex === section.content.length - 1}
          style={[
            s.navBtn,
            {
              backgroundColor:
                activeIndex === section.content.length - 1
                  ? isDark
                    ? '#374151'
                    : '#E5E7EB'
                  : accent,
              opacity: activeIndex === section.content.length - 1 ? 0.4 : 1,
            },
          ]}>
          <MaterialIcons
            name="chevron-right"
            size={22}
            color={
              activeIndex === section.content.length - 1 ? colors.textSecondary : '#FFFFFF'
            }
          />
        </Pressable>
      </View>

      {/* Dot indicators */}
      <View style={[s.dotsRow, { paddingBottom: insets.bottom + 16 }]}>
        {section.content.map((_, i) => (
          <View
            key={i}
            style={[
              s.dot,
              {
                backgroundColor:
                  i === activeIndex ? accent : isDark ? '#374151' : '#D1D5DB',
                width: i === activeIndex ? 20 : 6,
              },
            ]}
          />
        ))}
      </View>
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

  /* Banner */
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: BorderRadius.lg,
    gap: 14,
    marginBottom: 20,
  },
  bannerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 3,
  },
  bannerSub: {
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
    paddingBottom: 20,
    minHeight: 240,
    justifyContent: 'flex-start',
  },
  cardTopBar: {
    height: 5,
    width: '100%',
  },
  cardBadgeRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  cardTypeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardRuleNumber: {
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardContent: {
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 26,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
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
    paddingTop: 16,
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
    paddingTop: 12,
    gap: 4,
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
