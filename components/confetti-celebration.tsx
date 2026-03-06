import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View, Text, Pressable, Modal } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

interface ConfettiPiece {
  id: number;
  x: number;
  y: Animated.Value;
  rotation: Animated.Value;
  color: string;
  size: number;
  delay: number;
  duration: number;
  wobble: number;
}

interface ConfettiCelebrationProps {
  visible: boolean;
  onClose: () => void;
  levelName: string;
  correctCount: number;
  totalCount: number;
  categoryColor: string;
  isLastLevel?: boolean;
  onContinue?: () => void;
}

export function ConfettiCelebration({
  visible,
  onClose,
  levelName,
  correctCount,
  totalCount,
  categoryColor,
  isLastLevel = false,
  onContinue,
}: ConfettiCelebrationProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const starAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Generate confetti pieces
      const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * SCREEN_WIDTH,
        y: new Animated.Value(-50),
        rotation: new Animated.Value(0),
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 8 + Math.random() * 12,
        delay: Math.random() * 500,
        duration: 2500 + Math.random() * 1500,
        wobble: (Math.random() - 0.5) * 100,
      }));
      setConfettiPieces(pieces);

      // Animate confetti
      pieces.forEach((piece) => {
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(piece.y, {
              toValue: SCREEN_HEIGHT + 100,
              duration: piece.duration,
              useNativeDriver: true,
            }),
            Animated.timing(piece.rotation, {
              toValue: 360 * (2 + Math.random() * 3),
              duration: piece.duration,
              useNativeDriver: true,
            }),
          ]).start();
        }, piece.delay);
      });

      // Animate card entrance
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
        delay: 300,
      }).start();

      // Animate stars
      Animated.sequence([
        Animated.delay(600),
        Animated.spring(starAnim, {
          toValue: 1,
          tension: 60,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      starAnim.setValue(0);
    }
  }, [visible, scaleAnim, starAnim]);

  const accuracy = Math.round((correctCount / totalCount) * 100);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Confetti layer */}
        <View style={styles.confettiLayer} pointerEvents="none">
          {confettiPieces.map((piece) => (
            <Animated.View
              key={piece.id}
              style={[
                styles.confetti,
                {
                  left: piece.x,
                  backgroundColor: piece.color,
                  width: piece.size,
                  height: piece.size,
                  borderRadius: piece.size / 4,
                  transform: [
                    { translateY: piece.y },
                    {
                      translateX: piece.y.interpolate({
                        inputRange: [-50, SCREEN_HEIGHT + 100],
                        outputRange: [0, piece.wobble],
                      }),
                    },
                    {
                      rotate: piece.rotation.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>

        {/* Celebration card */}
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          {/* Trophy/Star animation */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                backgroundColor: categoryColor + '20',
                transform: [
                  {
                    scale: starAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 1.3, 1],
                    }),
                  },
                ],
              },
            ]}>
            <MaterialIcons
              name={isLastLevel ? 'emoji-events' : 'star'}
              size={56}
              color={categoryColor}
            />
          </Animated.View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            {isLastLevel ? 'Category Mastered!' : 'Level Complete!'}
          </Text>

          {/* Level name */}
          <View style={[styles.levelBadge, { backgroundColor: categoryColor }]}>
            <Text style={styles.levelBadgeText}>{levelName}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: categoryColor }]}>{correctCount}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Correct</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{totalCount}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: accuracy >= 75 ? colors.correct : colors.warning }]}>
                {accuracy}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Accuracy</Text>
            </View>
          </View>

          {/* Message */}
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {isLastLevel
              ? "Congratulations! You've mastered all levels in this category."
              : accuracy >= 90
              ? 'Outstanding performance! Keep up the amazing work!'
              : accuracy >= 75
              ? 'Great job! You passed with flying colors!'
              : 'Well done! You met the requirements to advance.'}
          </Text>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={[styles.primaryButton, { backgroundColor: categoryColor }]}
              onPress={onContinue || onClose}>
              <Text style={styles.primaryButtonText}>
                {isLastLevel ? 'Back to Categories' : 'Continue'}
              </Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  confettiLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  confetti: {
    position: 'absolute',
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: BorderRadius.xl,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  levelBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginBottom: 24,
  },
  levelBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 12,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
