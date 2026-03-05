import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import type { Question } from '@/data/questions';
import { Image } from 'expo-image';
import { TEST_IMAGES } from '@/data/images';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedAnswer: string, correct: boolean) => void;
  showExplanation?: boolean;
}

const OPTION_LABELS = ['A', 'B', 'C'] as const;

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  showExplanation = true,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const handleSelect = (option: string) => {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);
    const isCorrect = option === question.correctAnswer;
    onAnswer(option, isCorrect);
  };

  const getOptionStyle = (option: string) => {
    if (!revealed) {
      return {
        bg: selected === option ? colors.accentLight : colors.surface,
        border: selected === option ? colors.accent : colors.border,
        text: colors.text,
        labelBg: colors.border,
      };
    }
    if (option === question.correctAnswer) {
      return {
        bg: colors.correctBg,
        border: colors.correct,
        text: colors.text,
        labelBg: colors.correct,
      };
    }
    if (option === selected) {
      return {
        bg: colors.wrongBg,
        border: colors.wrong,
        text: colors.text,
        labelBg: colors.wrong,
      };
    }
    return {
      bg: colors.surface,
      border: colors.border,
      text: colors.textSecondary,
      labelBg: colors.border,
    };
  };

  return (
    <View style={styles.wrapper}>
      {/* Progress indicator */}
      <View style={styles.progressRow}>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          Question {questionNumber} of {totalQuestions}
        </Text>
        <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(questionNumber / totalQuestions) * 100}%`,
                backgroundColor: colors.accent,
              },
            ]}
          />
        </View>
      </View>

      {question.image && (
  <View style={{ marginBottom: 12, alignItems: 'center' }}>
    <Image
      source={TEST_IMAGES[question.image.split('/').pop() ?? '']}
      style={{ width: '90%', height: 210, borderRadius: BorderRadius.md }}
      contentFit="contain"
    />
  </View>
)}

      {/* Question text */}
      <Text style={[styles.questionText, { color: colors.text }]}>{question.question}</Text>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {OPTION_LABELS.map((label) => {
          const optionText = question.options[label];
          const st = getOptionStyle(label);
          return (
            <Pressable
              key={label}
              onPress={() => handleSelect(label)}
              disabled={revealed}
              style={[
                styles.option,
                {
                  backgroundColor: st.bg,
                  borderColor: st.border,
                },
              ]}>
              <View
                style={[
                  styles.optionLabel,
                  {
                    backgroundColor: st.labelBg,
                  },
                ]}>
                <Text
                  style={[
                    styles.optionLabelText,
                    {
                      color:
                        revealed && (label === question.correctAnswer || label === selected)
                          ? '#FFFFFF'
                          : colors.text,
                    },
                  ]}>
                  {label}
                </Text>
              </View>
              <Text style={[styles.optionText, { color: st.text }]} numberOfLines={3}>
                {optionText}
              </Text>
              {revealed && label === question.correctAnswer && (
                <MaterialIcons name="check-circle" size={22} color={colors.correct} />
              )}
              {revealed && label === selected && label !== question.correctAnswer && (
                <MaterialIcons name="cancel" size={22} color={colors.wrong} />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Explanation */}
      {revealed && showExplanation && (
        <View style={[styles.explanation, { backgroundColor: colors.accentLight, borderColor: colors.accent + '40' }]}>
          <View style={styles.explanationHeader}>
            <MaterialIcons name="lightbulb" size={18} color={colors.accent} />
            <Text style={[styles.explanationTitle, { color: colors.accent }]}>Explanation</Text>
          </View>
          <Text style={[styles.explanationText, { color: colors.text }]}>
            {question.explanation}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    gap: 16,
  },
  progressRow: {
    gap: 8,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '500',
  },
  progressBg: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    gap: 12,
  },
  optionLabel: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  explanation: {
    padding: 16,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: 8,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
