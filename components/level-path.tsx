import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import type { Level, CategoryLevelProgress } from '@/lib/levels';

interface LevelPathProps {
  progress: CategoryLevelProgress;
  categoryColor: string;
  onSelectLevel: (level: Level) => void;
}

export function LevelPath({ progress, categoryColor, onSelectLevel }: LevelPathProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const getLevelState = (level: Level): 'completed' | 'current' | 'locked' => {
    if (level.completed) return 'completed';
    if (level.unlocked) return 'current';
    return 'locked';
  };

  const getLevelColors = (state: 'completed' | 'current' | 'locked') => {
    switch (state) {
      case 'completed':
        return {
          bg: categoryColor,
          border: categoryColor,
          icon: '#FFFFFF',
          ring: categoryColor + '30',
        };
      case 'current':
        return {
          bg: categoryColor,
          border: categoryColor,
          icon: '#FFFFFF',
          ring: categoryColor + '40',
        };
      case 'locked':
        return {
          bg: colors.border,
          border: colors.border,
          icon: colors.textSecondary,
          ring: 'transparent',
        };
    }
  };

  // Create a winding path pattern (alternating left/right positions)
  const getHorizontalOffset = (index: number): number => {
    const pattern = [0, 40, 60, 40, 0]; // Winding path offsets
    return pattern[index % pattern.length];
  };

  return (
    <View style={styles.container}>
      {/* Path connecting dots */}
      <View style={styles.pathContainer}>
        {progress.levels.map((level, index) => {
          const state = getLevelState(level);
          const levelColors = getLevelColors(state);
          const horizontalOffset = getHorizontalOffset(index);
          const isLast = index === progress.levels.length - 1;

          return (
            <View key={level.id} style={styles.levelRow}>
              {/* Connecting line to next level */}
              {!isLast && (
                <View
                  style={[
                    styles.connector,
                    {
                      backgroundColor: index < progress.completedLevels.length 
                        ? categoryColor + '60' 
                        : colors.border,
                      left: 50 + horizontalOffset,
                      top: 80,
                      transform: [{ rotate: getHorizontalOffset(index + 1) > horizontalOffset ? '20deg' : '-20deg' }],
                    },
                  ]}
                />
              )}
              
              <LevelNode
                level={level}
                state={state}
                levelColors={levelColors}
                categoryColor={categoryColor}
                colors={colors}
                horizontalOffset={horizontalOffset}
                onPress={() => (state !== 'locked') && onSelectLevel(level)}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

interface LevelNodeProps {
  level: Level;
  state: 'completed' | 'current' | 'locked';
  levelColors: { bg: string; border: string; icon: string; ring: string };
  categoryColor: string;
  colors: typeof Colors.light;
  horizontalOffset: number;
  onPress: () => void;
}

function LevelNode({ level, state, levelColors, categoryColor, colors, horizontalOffset, onPress }: LevelNodeProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state === 'current') {
      // Pulse animation for current level
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [state, pulseAnim]);

  const handlePressIn = () => {
    if (state !== 'locked') {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const progressPercent = level.questionsRequired > 0 
    ? (level.currentProgress / level.questionsRequired) * 100 
    : 0;

  return (
    <View style={[styles.levelNodeContainer, { marginLeft: horizontalOffset }]}>
      {/* Level name label */}
      <View style={[styles.levelLabel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.levelLabelText, { color: colors.text }]}>{level.name}</Text>
        {state === 'completed' && (
          <MaterialIcons name="verified" size={14} color={categoryColor} style={{ marginLeft: 4 }} />
        )}
      </View>

      {/* Main level node */}
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={state === 'locked'}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          {/* Pulse ring for current level */}
          {state === 'current' && (
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  borderColor: categoryColor,
                  transform: [{ scale: pulseAnim }],
                  opacity: pulseAnim.interpolate({
                    inputRange: [1, 1.15],
                    outputRange: [0.6, 0],
                  }),
                },
              ]}
            />
          )}

          {/* Progress ring for current level */}
          {state === 'current' && progressPercent > 0 && (
            <View style={styles.progressRingContainer}>
              <View
                style={[
                  styles.progressRing,
                  {
                    borderColor: colors.border,
                    borderTopColor: categoryColor,
                    borderRightColor: progressPercent > 25 ? categoryColor : colors.border,
                    borderBottomColor: progressPercent > 50 ? categoryColor : colors.border,
                    borderLeftColor: progressPercent > 75 ? categoryColor : colors.border,
                  },
                ]}
              />
            </View>
          )}

          {/* Level circle */}
          <View
            style={[
              styles.levelCircle,
              {
                backgroundColor: levelColors.bg,
                borderColor: levelColors.border,
                shadowColor: state !== 'locked' ? categoryColor : 'transparent',
              },
            ]}>
            {state === 'completed' ? (
              <MaterialIcons name="check" size={32} color={levelColors.icon} />
            ) : state === 'locked' ? (
              <MaterialIcons name="lock" size={28} color={levelColors.icon} />
            ) : (
              <MaterialIcons name={level.icon as any} size={28} color={levelColors.icon} />
            )}
          </View>

          {/* Start button for current level */}
          {state === 'current' && (
            <View style={[styles.startBadge, { backgroundColor: '#FFFFFF' }]}>
              <Text style={[styles.startText, { color: categoryColor }]}>START</Text>
            </View>
          )}
        </Animated.View>
      </Pressable>

      {/* Level requirements */}
      <View style={styles.requirementsContainer}>
        <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
          {state === 'completed' 
            ? `${level.correctAnswers}/${level.totalAttempts} correct` 
            : state === 'current' && level.currentProgress > 0
            ? `${level.currentProgress}/${level.questionsRequired} done`
            : `${level.questionsRequired}Q / ${level.minCorrectPercent}%`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  pathContainer: {
    alignItems: 'center',
  },
  levelRow: {
    position: 'relative',
    marginBottom: 20,
  },
  connector: {
    position: 'absolute',
    width: 4,
    height: 60,
    borderRadius: 2,
    zIndex: 0,
  },
  levelNodeContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  levelLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginBottom: 12,
  },
  levelLabelText: {
    fontSize: 13,
    fontWeight: '600',
  },
  pulseRing: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    top: -4,
    left: -4,
  },
  progressRingContainer: {
    position: 'absolute',
    width: 88,
    height: 88,
    top: -4,
    left: -4,
  },
  progressRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
  },
  levelCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startBadge: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    transform: [{ translateX: -28 }],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  startText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  requirementsContainer: {
    marginTop: 16,
  },
  requirementText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
