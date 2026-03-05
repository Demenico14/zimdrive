import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import { useApp } from '@/contexts/app-context';
import { useState } from 'react';

const FEATURES = [
  { icon: 'all-inclusive' as const, text: 'Unlimited questions every day' },
  { icon: 'timer' as const, text: 'Unlimited mock tests' },
  { icon: 'replay' as const, text: 'Full access to review wrong answers' },
  { icon: 'update' as const, text: 'Future question updates included' },
  { icon: 'wifi-off' as const, text: 'Everything works offline' },
];

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { setPurchased, purchased } = useApp();
  const [processing, setProcessing] = useState(false);

  const handlePurchase = async () => {
    setProcessing(true);
    // In production, this would:
    // 1. Call your backend to create a Paynow transaction
    // 2. Open the Paynow payment page or deep link to EcoCash/OneMoney
    // 3. Poll the backend for payment status
    // 4. Receive a signed receipt token
    // 5. Store locally and mark as purchased

    // For demo, simulate the flow
    setTimeout(async () => {
      setProcessing(false);
      Alert.alert(
        'Paynow Integration',
        'In production, this would redirect to Paynow for EcoCash/OneMoney payment. For demo purposes, would you like to simulate a successful purchase?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Simulate Payment',
            onPress: async () => {
              await setPurchased();
              Alert.alert('Purchase Successful', 'You now have lifetime access to all questions!');
              router.back();
            },
          },
        ]
      );
    }, 1000);
  };

  if (purchased) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.purchasedContent}>
          <View style={[styles.purchasedIcon, { backgroundColor: colors.correctBg }]}>
            <MaterialIcons name="verified" size={56} color={colors.correct} />
          </View>
          <Text style={[styles.purchasedTitle, { color: colors.text }]}>Already Unlocked</Text>
          <Text style={[styles.purchasedSub, { color: colors.textSecondary }]}>
            You have lifetime access to all questions and features.
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={[styles.purchasedButton, { backgroundColor: colors.accent }]}>
            <Text style={styles.purchasedButtonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Pressable onPress={() => router.back()} style={[styles.closeButton, { top: insets.top + 12 }]}>
        <MaterialIcons name="close" size={24} color={colors.text} />
      </Pressable>

      <View style={[styles.content, { paddingTop: insets.top + 48 }]}>
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={[styles.lockIcon, { backgroundColor: colors.accentLight }]}>
            <MaterialIcons name="lock-open" size={48} color={colors.accent} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Unlock Full Access
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            One-time payment. No subscriptions. No hidden fees.
          </Text>
        </View>

        {/* Features */}
        <View style={[styles.featuresCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {FEATURES.map((f, i) => (
            <View key={i}>
              <View style={styles.featureRow}>
                <View style={[styles.featureIcon, { backgroundColor: colors.accentLight }]}>
                  <MaterialIcons name={f.icon} size={18} color={colors.accent} />
                </View>
                <Text style={[styles.featureText, { color: colors.text }]}>{f.text}</Text>
              </View>
              {i < FEATURES.length - 1 && (
                <View style={[styles.featureDivider, { backgroundColor: colors.border }]} />
              )}
            </View>
          ))}
        </View>

        {/* Price */}
        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={[styles.currency, { color: colors.textSecondary }]}>$</Text>
            <Text style={[styles.price, { color: colors.text }]}>4</Text>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>.00 USD{'\n'}one-time</Text>
          </View>
        </View>

        {/* Purchase button */}
        <Pressable
          onPress={handlePurchase}
          disabled={processing}
          style={[
            styles.purchaseButton,
            { backgroundColor: processing ? colors.textSecondary : colors.accent },
          ]}>
          {processing ? (
            <Text style={styles.purchaseButtonText}>Processing...</Text>
          ) : (
            <>
              <Text style={styles.purchaseButtonText}>Pay with Paynow</Text>
              <Text style={styles.purchaseSubtext}>EcoCash / OneMoney / Card</Text>
            </>
          )}
        </Pressable>

        <Text style={[styles.footer, { color: colors.textSecondary }]}>
          Payment secured via Paynow Zimbabwe. Your purchase will be verified server-side.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 24,
  },
  headerSection: {
    alignItems: 'center',
    gap: 8,
  },
  lockIcon: {
    width: 88,
    height: 88,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 15,
  },
  featureDivider: {
    height: 1,
    marginLeft: 58,
  },
  priceSection: {
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 6,
  },
  price: {
    fontSize: 52,
    fontWeight: '800',
    lineHeight: 56,
  },
  priceLabel: {
    fontSize: 14,
    marginTop: 8,
    marginLeft: 2,
    lineHeight: 18,
  },
  purchaseButton: {
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: BorderRadius.lg,
    gap: 2,
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  purchaseSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
  },
  purchasedContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  purchasedIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  purchasedTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  purchasedSub: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  purchasedButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.lg,
    marginTop: 8,
  },
  purchasedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
