import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useApp } from '@/contexts/app-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import { FREE_DAILY_LIMIT } from '@/lib/storage';
import { useRouter } from 'expo-router';

export function QuotaBadge() {
  const { purchased, remainingQuestions } = useApp();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  if (purchased) {
    return (
      <View style={[styles.badge, { backgroundColor: colors.correctBg }]}>
        <MaterialIcons name="verified" size={16} color={colors.correct} />
        <Text style={[styles.text, { color: colors.correct }]}>PRO</Text>
      </View>
    );
  }

  const isLow = remainingQuestions <= 2;

  return (
    <Pressable
      onPress={() => router.push('/paywall')}
      style={[
        styles.badge,
        {
          backgroundColor: isLow ? colors.wrongBg : colors.warningBg,
        },
      ]}>
      <MaterialIcons
        name="bolt"
        size={16}
        color={isLow ? colors.wrong : colors.warning}
      />
      <Text
        style={[
          styles.text,
          { color: isLow ? colors.wrong : colors.warning },
        ]}>
        {remainingQuestions}/{FREE_DAILY_LIMIT}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
  },
});
