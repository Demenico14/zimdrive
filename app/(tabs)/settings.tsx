import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';
import { useApp } from '@/contexts/app-context';
import { useRouter } from 'expo-router';
import { resetAllData } from '@/lib/storage';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { purchased, setPurchased, refreshStats, logout, user } = useApp();
  const router = useRouter();

  const handleRestorePurchase = async () => {
    // In production, this would verify with your backend
    Alert.alert(
      'Restore Purchase',
      'Purchase restoration would verify with the server. For demo purposes, this will unlock the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          onPress: async () => {
            await setPurchased();
            Alert.alert('Success', 'Your purchase has been restored.');
          },
        },
      ]
    );
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'This will delete all your progress, stats, and practice history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetAllData();
            await refreshStats();
            Alert.alert('Done', 'All progress has been reset.');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // onAuthStateChanged will set user to null, triggering redirect
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      {/* Profile Card */}
      {user && (
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.profileAvatar, { backgroundColor: colors.accent + '20' }]}>
            <Text style={[styles.profileInitial, { color: colors.accent }]}>
              {(user.displayName || user.email || user.phoneNumber || '?')[0].toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            {user.displayName ? (
              <Text style={[styles.profileName, { color: colors.text }]}>{user.displayName}</Text>
            ) : null}
            <Text style={[styles.profileDetail, { color: colors.textSecondary }]}>
              {user.email || user.phoneNumber || 'User'}
            </Text>
          </View>
        </View>
      )}

      {/* Account Section */}
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>ACCOUNT</Text>
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.row}>
          <MaterialIcons
            name={purchased ? 'verified' : 'person'}
            size={22}
            color={purchased ? colors.correct : colors.icon}
          />
          <View style={styles.rowInfo}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>
              {purchased ? 'Lifetime Access' : 'Free Plan'}
            </Text>
            <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
              {purchased ? 'All questions unlocked' : '5 questions per day'}
            </Text>
          </View>
        </View>

        {!purchased && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Pressable style={styles.row} onPress={() => router.push('/paywall')}>
              <MaterialIcons name="lock-open" size={22} color={colors.accent} />
              <View style={styles.rowInfo}>
                <Text style={[styles.rowTitle, { color: colors.accent }]}>Upgrade to Lifetime</Text>
                <Text style={[styles.rowSub, { color: colors.textSecondary }]}>One-time $4 USD</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={colors.textSecondary} />
            </Pressable>
          </>
        )}

        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Pressable style={styles.row} onPress={handleRestorePurchase}>
          <MaterialIcons name="restore" size={22} color={colors.icon} />
          <View style={styles.rowInfo}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Restore Purchase</Text>
            <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
              Recover previous payment
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={colors.textSecondary} />
        </Pressable>
      </View>

      {/* Data Section */}
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>DATA</Text>
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Pressable style={styles.row} onPress={handleResetProgress}>
          <MaterialIcons name="delete-outline" size={22} color={colors.wrong} />
          <View style={styles.rowInfo}>
            <Text style={[styles.rowTitle, { color: colors.wrong }]}>Reset All Progress</Text>
            <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
              Clear stats and practice history
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Sign Out */}
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 8 }]}>
        <Pressable style={styles.row} onPress={handleLogout}>
          <MaterialIcons name="logout" size={22} color={colors.wrong} />
          <View style={styles.rowInfo}>
            <Text style={[styles.rowTitle, { color: colors.wrong }]}>Sign Out</Text>
          </View>
        </Pressable>
      </View>

      {/* About Section */}
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>ABOUT</Text>
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.row}>
          <MaterialIcons name="info-outline" size={22} color={colors.icon} />
          <View style={styles.rowInfo}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Version</Text>
            <Text style={[styles.rowSub, { color: colors.textSecondary }]}>1.0.0</Text>
          </View>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.row}>
          <MaterialIcons name="gavel" size={22} color={colors.icon} />
          <View style={styles.rowInfo}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Terms of Service</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={colors.textSecondary} />
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.row}>
          <MaterialIcons name="privacy-tip" size={22} color={colors.icon} />
          <View style={styles.rowInfo}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Privacy Policy</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={colors.textSecondary} />
        </View>
      </View>

      <Text style={[styles.footerText, { color: colors.textSecondary }]}>
        ZimDrive - Zimbabwe Driving Theory Practice
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    gap: 14,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 22,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '600',
  },
  profileDetail: {
    fontSize: 14,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 8,
  },
  section: {
    marginHorizontal: 20,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  rowInfo: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 15, fontWeight: '500' },
  rowSub: { fontSize: 13 },
  divider: { height: 1, marginLeft: 48 },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: 16,
    marginBottom: 12,
  },
});
