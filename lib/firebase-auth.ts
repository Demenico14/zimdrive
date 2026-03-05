import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';

// ── Email / Password ──

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<FirebaseAuthTypes.UserCredential> {
  const credential = await auth().createUserWithEmailAndPassword(email, password);
  if (displayName && credential.user) {
    await credential.user.updateProfile({ displayName });
  }
  return credential;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<FirebaseAuthTypes.UserCredential> {
  return auth().signInWithEmailAndPassword(email, password);
}

// ── Phone / SMS OTP ──

let phoneConfirmation: FirebaseAuthTypes.ConfirmationResult | null = null;

export async function sendPhoneOTP(phoneNumber: string): Promise<void> {
  phoneConfirmation = await auth().signInWithPhoneNumber(phoneNumber);
}

export async function confirmPhoneOTP(
  code: string
): Promise<FirebaseAuthTypes.UserCredential | null> {
  if (!phoneConfirmation) {
    throw new Error('No OTP request in progress. Call sendPhoneOTP first.');
  }
  const result = await phoneConfirmation.confirm(code);
  phoneConfirmation = null;
  return result;
}

// ── Sign out ──

export async function firebaseSignOut(): Promise<void> {
  await auth().signOut();
}

// ── Auth state listener ──

export function onAuthStateChanged(
  callback: (user: FirebaseAuthTypes.User | null) => void
): () => void {
  if (!firebase.apps.length) {
    callback(null);
    return () => {};
  }
  return auth().onAuthStateChanged(callback);
}

// ── Password reset ──

export async function sendPasswordReset(email: string): Promise<void> {
  await auth().sendPasswordResetEmail(email);
}

// ── Current user ──

export function getCurrentUser(): FirebaseAuthTypes.User | null {
  return auth().currentUser;
}

// ── Friendly error messages ──

export function getAuthErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code;
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Try signing in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/invalid-phone-number':
      return 'Please enter a valid phone number with country code.';
    case 'auth/invalid-verification-code':
      return 'Invalid OTP code. Please check and try again.';
    case 'auth/session-expired':
      return 'OTP has expired. Please request a new one.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    default:
      return (error as Error)?.message ?? 'Something went wrong. Please try again.';
  }
}
