import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type FieldValue,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbdpxxfpjM5dj3Iv2CEYp8kF9klbeE7iA",
  authDomain: "asgard-f8f99.firebaseapp.com",
  projectId: "asgard-f8f99",
  storageBucket: "asgard-f8f99.firebasestorage.app",
  messagingSenderId: "926410468596",
  appId: "1:926410468596:web:8a8d531a50bc4ef0ce82a1",
  measurementId: "G-1YKJNKPEBZ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Auth helpers
export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signInEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  return fbSignOut(auth);
}

export { onAuthStateChanged, type User };

// Player profile in Firestore
export interface PlayerProfile {
  uid: string;
  nickname: string;
  xp: number;
  coins: number;
  energy: number;
  maxEnergy: number;
  rank: string;
  level: number;
  streak: number;
  vip: boolean;
  cards: string[];
  questsCompleted: string[];
  totalTimeMinutes: number;
  weeklyTimeMinutes: number;
  lastLogin: FieldValue | null;
  createdAt: FieldValue | null;
}

export async function getPlayerProfile(uid: string): Promise<PlayerProfile | null> {
  const snap = await getDoc(doc(db, "players", uid));
  return snap.exists() ? (snap.data() as PlayerProfile) : null;
}

export async function createPlayerProfile(uid: string, nickname: string): Promise<void> {
  await setDoc(doc(db, "players", uid), {
    uid,
    nickname,
    xp: 0,
    coins: 50,
    energy: 100,
    maxEnergy: 100,
    rank: "E",
    level: 1,
    streak: 0,
    vip: false,
    cards: [],
    questsCompleted: [],
    totalTimeMinutes: 0,
    weeklyTimeMinutes: 0,
    lastLogin: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
}

export async function updatePlayerField(uid: string, fields: Partial<PlayerProfile>) {
  await updateDoc(doc(db, "players", uid), fields);
}
