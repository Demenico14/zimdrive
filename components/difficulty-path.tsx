import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import type { Level, DifficultySection, CategoryLevelProgress, DifficultyTier } from '@/lib/levels';

interface DifficultyPathProps {
  progress: CategoryLevelProgress;
  categoryColor: string;
  onSelectLevel: (level: Level) => void;
}

export function DifficultyPath({ progress, categoryColor, onSelectLevel }: DifficultyPathProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      {progress.sections.map((section, sectionIndex) => (
        <DifficultyBlock
          key={section.difficulty}
          section={section}
          sectionIndex={sectionIndex}
          progress={progress}
          categoryColor={categoryColor}
          colors={colors}
          onSelectLevel={onSelectLevel}
          isLast={sectionIndex === progress.sections.length - 1}
        />
      ))}
    </View>
  );
}

interface DifficultyBlockProps {
  section: DifficultySection;
  sectionIndex: number;
  progress: CategoryLevelProgress;
  categoryColor: string;
  colors: typeof Colors.light;
  onSelectLevel: (level: Level) => void;
  isLast: boolean;
}

function DifficultyBlock({
  section,
  sectionIndex,
  progress,
  categoryColor,
  colors,
  onSelectLevel,
  isLast,
}: DifficultyBlockProps) {
  const completedCount = section.levels.filter(l => l.completed).length;
  const totalLevels = section.levels.length;
  const progressPercent = (completedCount / totalLevels) * 100;
  const isUnlocked = section.unlocked;
  const isCompleted = section.completed;

  return (
    <View style={styles.sectionContainer}>
      {/* Section Header */}
      <View 
        style={[
          styles.sectionHeader, 
          { 
            backgroundColor: isUnlocked ? section.color + '15' : colors.border + '50',
            borderColor: isUnlocked ? section.color + '30' : colors.border,
          }
        ]}
      >
        <View style={styles.sectionHeaderContent}>
          <View 
            style={[
              styles.sectionIconContainer, 
              { backgroundColor: isUnlocked ? section.color : colors.border }
            ]}
          >
            {isCompleted ? (
              <MaterialIcons name="check-circle" size={24} color="#FFFFFF" />
            ) : !isUnlocked ? (
              <MaterialIcons name="lock" size={24} color="#FFFFFF" />
            ) : (
              <MaterialIcons name={section.icon as any} size={24} color="#FFFFFF" />
            )}
          </View>
          
          <View style={styles.sectionTextContainer}>
            <View style={styles.sectionTitleRow}>
              <Text 
                style={[
                  styles.sectionTitle, 
                  { color: isUnlocked ? colors.text : colors.textSecondary }
                ]}
              >
                {section.name}
              </Text>
              {isCompleted && (
                <View style={[styles.completedBadge, { backgroundColor: section.color }]}>
                  <Text style={styles.completedBadgeText}>COMPLETE</Text>
                </View>
              )}
            </View>
            <Text 
              style={[
                styles.sectionDescription, 
                { color: colors.textSecondary }
              ]}
            >
              {section.description}
            </Text>
          </View>
        </View>
        
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
            <Animated.View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progressPercent}%`,
                  backgroundColor: section.color,
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {completedCount}/{totalLevels} levels
          </Text>
        </View>
      </View>

      {/* Levels within section */}
      <View style={styles.levelsContainer}>
        {section.levels.map((level, levelIndex) => (
          <LevelCard
            key={level.id}
            level={level}
            levelIndex={levelIndex}
            sectionColor={section.color}
            categoryColor={categoryColor}
            colors={colors}
            isUnlocked={level.unlocked}
            onSelect={() => onSelectLevel(level)}
            isLastInSection={levelIndex === section.levels.length - 1}
          />
        ))}
      </View>

      {/* Connector to next section */}
      {!isLast && (
        <View style={styles.sectionConnector}>
          <View 
            style={[
              styles.connectorLine, 
              { 
                backgroundColor: isCompleted ? section.color : colors.border 
              }
            ]} 
          />
          <View 
            style={[
              styles.connectorArrow, 
              { 
                backgroundColor: isCompleted ? section.color : colors.border 
              }
            ]}
          >
            <MaterialIcons 
              name="keyboard-arrow-down" 
              size={20} 
              color={isCompleted ? '#FFFFFF' : colors.textSecondary} 
            />
          </View>
        </View>
      )}
    </View>
  );
}

interface LevelCardProps {
  level: Level;
  levelIndex: number;
  sectionColor: string;
  categoryColor: string;
  colors: typeof Colors.light;
  isUnlocked: boolean;
  onSelect: () => void;
  isLastInSection: boolean;
}

function LevelCard({
  level,
  levelIndex,
  sectionColor,
  categoryColor,
  colors,
  isUnlocked,
  onSelect,
  isLastInSection,
}: LevelCardProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const isCompleted = level.completed;
  const isCurrent = isUnlocked && !isCompleted;
  const isLocked = !isUnlocked;

  useEffect(() => {
    if (isCurrent) {
      // Gentle pulse animation for current level
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isCurrent, pulseAnim]);

  const handlePressIn = () => {
    if (!isLocked) {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
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

  const getCardStyle = () => {
    if (isCompleted) {
      return {
        backgroundColor: sectionColor + '10',
        borderColor: sectionColor + '40',
      };
    }
    if (isCurrent) {
      return {
        backgroundColor: colors.surface,
        borderColor: sectionColor,
      };
    }
    return {
      backgroundColor: colors.border + '30',
      borderColor: colors.border,
    };
  };

  const cardStyle = getCardStyle();

  return (
    <View style={styles.levelCardWrapper}>
      {/* Connector dot and line */}
      <View style={styles.levelConnector}>
        <View 
          style={[
            styles.levelDot, 
            { 
              backgroundColor: isCompleted ? sectionColor : isUnlocked ? sectionColor : colors.border,
              borderColor: isCompleted ? sectionColor : isUnlocked ? sectionColor : colors.border,
            }
          ]} 
        />
        {!isLastInSection && (
          <View 
            style={[
              styles.levelLine, 
              { backgroundColor: isCompleted ? sectionColor + '60' : colors.border }
            ]} 
          />
        )}
      </View>

      {/* Level card */}
      <Pressable
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isLocked}
        style={styles.levelCardPressable}
      >
        <Animated.View
          style={[
            styles.levelCard,
            cardStyle,
            {
              transform: [{ scale: isCurrent ? pulseAnim : scaleAnim }],
              shadowColor: isCurrent ? sectionColor : 'transparent',
              shadowOpacity: isCurrent ? 0.3 : 0,
              shadowRadius: isCurrent ? 12 : 0,
              elevation: isCurrent ? 8 : 0,
            },
          ]}
        >
          {/* Level icon */}
          <View 
            style={[
              styles.levelIconContainer, 
              { 
                backgroundColor: isCompleted ? sectionColor : isUnlocked ? sectionColor + '20' : colors.border + '50',
              }
            ]}
          >
            {isCompleted ? (
              <MaterialIcons name="check" size={22} color="#FFFFFF" />
            ) : isLocked ? (
              <MaterialIcons name="lock" size={20} color={colors.textSecondary} />
            ) : (
              <MaterialIcons name={level.icon as any} size={22} color={sectionColor} />
            )}
          </View>

          {/* Level info */}
          <View style={styles.levelInfo}>
            <View style={styles.levelTitleRow}>
              <Text 
                style={[
                  styles.levelTitle, 
                  { color: isLocked ? colors.textSecondary : colors.text }
                ]}
              >
                {level.name}
              </Text>
              {isCurrent && (
                <View style={[styles.currentBadge, { backgroundColor: sectionColor }]}>
                  <Text style={styles.currentBadgeText}>NEXT</Text>
                </View>
              )}
            </View>
            
            <Text style={[styles.levelRequirement, { color: colors.textSecondary }]}>
              {isCompleted 
                ? `${level.correctAnswers}/${level.totalAttempts} correct`
                : `${level.questionsRequired} questions - ${level.minCorrectPercent}% to pass`
              }
            </Text>

            {/* Mini progress for current level */}
            {isCurrent && level.currentProgress > 0 && (
              <View style={styles.miniProgressContainer}>
                <View style={[styles.miniProgressBg, { backgroundColor: colors.border }]}>
                  <View 
                    style={[
                      styles.miniProgressFill, 
                      { 
                        width: `${(level.currentProgress / level.questionsRequired) * 100}%`,
                        backgroundColor: sectionColor,
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.miniProgressText, { color: sectionColor }]}>
                  {level.currentProgress}/{level.questionsRequired}
                </Text>
              </View>
            )}
          </View>

          {/* Chevron or status */}
          <View style={styles.levelAction}>
            {isCompleted ? (
              <MaterialIcons name="verified" size={24} color={sectionColor} />
            ) : isCurrent ? (
              <View style={[styles.playButton, { backgroundColor: sectionColor }]}>
                <MaterialIcons name="play-arrow" size={20} color="#FFFFFF" />
              </View>
            ) : (
              <MaterialIcons name="chevron-right" size={24} color={colors.border} />
            )}
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
  },
  sectionContainer: {
    marginBottom: 8,
  },
  sectionHeader: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTextContainer: {
    flex: 1,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  completedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  completedBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  progressContainer: {
    gap: 6,
  },
  progressBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '500',
  },
  levelsContainer: {
    paddingLeft: 8,
  },
  levelCardWrapper: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  levelConnector: {
    width: 24,
    alignItems: 'center',
    marginRight: 8,
  },
  levelDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    zIndex: 1,
  },
  levelLine: {
    flex: 1,
    width: 2,
    marginTop: -2,
  },
  levelCardPressable: {
    flex: 1,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    padding: 12,
  },
  levelIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  levelTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  currentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  currentBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  levelRequirement: {
    fontSize: 12,
  },
  miniProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  miniProgressBg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  miniProgressText: {
    fontSize: 11,
    fontWeight: '600',
  },
  levelAction: {
    marginLeft: 8,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionConnector: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  connectorLine: {
    width: 2,
    height: 20,
  },
  connectorArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
});
