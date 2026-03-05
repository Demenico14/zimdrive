import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import {
  signInWithEmail,
  sendPhoneOTP,
  confirmPhoneOTP,
  sendPasswordReset,
  getAuthErrorMessage,
} from '@/lib/firebase-auth';

type AuthMode = 'email' | 'phone';
type PhoneStep = 'number' | 'otp';

export default function LoginScreen() {
  const [mode, setMode] = useState<AuthMode>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('number');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const otpInputRef = useRef<TextInput>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const clearError = () => setError('');

  // ── Email sign in ──
  const handleEmailLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    clearError();
    try {
      await signInWithEmail(email.trim(), password);
      // onAuthStateChanged in context will handle navigation
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Phone: send OTP ──
  const handleSendOTP = async () => {
    const cleaned = phone.trim();
    if (!cleaned || cleaned.length < 8) {
      setError('Please enter a valid phone number with country code (e.g. +263...).');
      return;
    }
    setLoading(true);
    clearError();
    try {
      await sendPhoneOTP(cleaned);
      setPhoneStep('otp');
      setTimeout(() => otpInputRef.current?.focus(), 300);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Phone: confirm OTP ──
  const handleConfirmOTP = async () => {
    if (otpCode.length < 6) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setLoading(true);
    clearError();
    try {
      await confirmPhoneOTP(otpCode);
      // onAuthStateChanged in context will handle navigation
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password ──
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Enter Email', 'Please enter your email address first, then tap Forgot password.');
      return;
    }
    try {
      await sendPasswordReset(email.trim());
      Alert.alert('Email Sent', 'Check your inbox for a password reset link.');
    } catch (err) {
      Alert.alert('Error', getAuthErrorMessage(err));
    }
  };

  // ── Switch mode ──
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setPhoneStep('number');
    setOtpCode('');
    clearError();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.inner, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo / Branding */}
        <View style={styles.brandSection}>
          <View style={[styles.logoCircle, { backgroundColor: colors.accent + '15' }]}>
            <MaterialIcons name="directions-car" size={48} color={colors.accent} />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>ZimDrive</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Sign in to continue your progress
          </Text>
        </View>

        {/* Mode Toggle */}
        <View style={[styles.modeToggle, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Pressable
            onPress={() => switchMode('email')}
            style={[
              styles.modeButton,
              mode === 'email' && { backgroundColor: colors.accent },
            ]}
          >
            <MaterialIcons
              name="mail-outline"
              size={18}
              color={mode === 'email' ? '#FFFFFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.modeButtonText,
                { color: mode === 'email' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              Email
            </Text>
          </Pressable>
          <Pressable
            onPress={() => switchMode('phone')}
            style={[
              styles.modeButton,
              mode === 'phone' && { backgroundColor: colors.accent },
            ]}
          >
            <MaterialIcons
              name="phone"
              size={18}
              color={mode === 'phone' ? '#FFFFFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.modeButtonText,
                { color: mode === 'phone' ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              Phone
            </Text>
          </Pressable>
        </View>

        {/* Error */}
        {error ? (
          <View style={[styles.errorBox, { backgroundColor: colors.wrongBg, borderColor: colors.wrong + '30' }]}>
            <MaterialIcons name="error-outline" size={18} color={colors.wrong} />
            <Text style={[styles.errorText, { color: colors.wrong }]}>{error}</Text>
          </View>
        ) : null}

        {/* Form */}
        <View style={styles.form}>
          {mode === 'email' ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Email</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <MaterialIcons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.textSecondary}
                    value={email}
                    onChangeText={(t) => { setEmail(t); clearError(); }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <MaterialIcons name="lock-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textSecondary}
                    value={password}
                    onChangeText={(t) => { setPassword(t); clearError(); }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                    <MaterialIcons
                      name={showPassword ? 'visibility' : 'visibility-off'}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                </View>
              </View>

              <Pressable onPress={handleForgotPassword} style={styles.forgotRow} disabled={loading}>
                <Text style={[styles.forgotText, { color: colors.accent }]}>Forgot password?</Text>
              </Pressable>

              <Pressable
                onPress={handleEmailLogin}
                style={[styles.primaryButton, { backgroundColor: colors.accent, opacity: loading ? 0.7 : 1 }]}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Sign In</Text>
                )}
              </Pressable>
            </>
          ) : (
            <>
              {phoneStep === 'number' ? (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      <MaterialIcons name="phone" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="+263 7X XXX XXXX"
                        placeholderTextColor={colors.textSecondary}
                        value={phone}
                        onChangeText={(t) => { setPhone(t); clearError(); }}
                        keyboardType="phone-pad"
                        autoComplete="tel"
                        editable={!loading}
                      />
                    </View>
                    <Text style={[styles.hint, { color: colors.textSecondary }]}>
                      Include country code (e.g. +263 for Zimbabwe)
                    </Text>
                  </View>

                  <Pressable
                    onPress={handleSendOTP}
                    style={[styles.primaryButton, { backgroundColor: colors.accent, opacity: loading ? 0.7 : 1 }]}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.primaryButtonText}>Send OTP</Text>
                    )}
                  </Pressable>
                </>
              ) : (
                <>
                  <View style={styles.otpHeader}>
                    <MaterialIcons name="sms" size={40} color={colors.accent} />
                    <Text style={[styles.otpTitle, { color: colors.text }]}>Enter Verification Code</Text>
                    <Text style={[styles.otpSubtitle, { color: colors.textSecondary }]}>
                      {'We sent a 6-digit code to '}
                      <Text style={{ fontWeight: '600', color: colors.text }}>{phone}</Text>
                    </Text>
                  </View>

                  <View style={styles.inputGroup}>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      <TextInput
                        ref={otpInputRef}
                        style={[styles.input, styles.otpInput, { color: colors.text }]}
                        placeholder="000000"
                        placeholderTextColor={colors.textSecondary}
                        value={otpCode}
                        onChangeText={(t) => { setOtpCode(t.replace(/[^0-9]/g, '').slice(0, 6)); clearError(); }}
                        keyboardType="number-pad"
                        maxLength={6}
                        editable={!loading}
                      />
                    </View>
                  </View>

                  <Pressable
                    onPress={handleConfirmOTP}
                    style={[styles.primaryButton, { backgroundColor: colors.accent, opacity: loading ? 0.7 : 1 }]}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.primaryButtonText}>Verify & Sign In</Text>
                    )}
                  </Pressable>

                  <View style={styles.otpActions}>
                    <Pressable onPress={() => { setPhoneStep('number'); setOtpCode(''); clearError(); }}>
                      <Text style={[styles.forgotText, { color: colors.accent }]}>Change number</Text>
                    </Pressable>
                    <Pressable onPress={handleSendOTP} disabled={loading}>
                      <Text style={[styles.forgotText, { color: colors.accent }]}>Resend code</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            {"Don't have an account? "}
          </Text>
          <Pressable onPress={() => router.push('/signup')}>
            <Text style={[styles.footerLink, { color: colors.accent }]}>Sign Up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    gap: 24,
  },
  brandSection: {
    alignItems: 'center',
    gap: 8,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
  },
  tagline: {
    fontSize: 15,
    textAlign: 'center',
  },
  modeToggle: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  modeButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 12,
  },
  eyeButton: {
    padding: 4,
  },
  hint: {
    fontSize: 13,
    marginLeft: 4,
    marginTop: 2,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '500',
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: BorderRadius.md,
    minHeight: 52,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  otpHeader: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  otpTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  otpSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  otpActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: '600',
  },
});
