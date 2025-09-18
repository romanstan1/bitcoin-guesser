import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as AuthUser,
} from "firebase/auth";
import {
  doc,
  DocumentReference,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase";

export type User = {
  score: number;
  lastGuess: string | null;
};

export const getUserRef = (userId: string) => {
  return doc(db, "users", userId);
};

export const createUser = async (userId: string) => {
  const userRef = getUserRef(userId);
  try {
    await setDoc(userRef, {
      score: 0,
      lastGuess: null,
    });
    return true;
  } catch {
    return false;
  }
};

export const getUser = async (userId: string): Promise<User | null> => {
  const userRef = getUserRef(userId);
  const userDoc = await getDoc(userRef);
  return userDoc.data() as User | null;
};

export const updateUser = async (userRef: DocumentReference, data: User) => {
  const updatedUser = await updateDoc(userRef, data);
  return updatedUser;
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const authedUser = result.user;

    return authedUser;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const onAuthStateChange = (
  callback: (user: AuthUser | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

export type BitcoinPriceData = {
  price: number;
  timestamp: string;
};

export const fetchBitcoinPrice = async (): Promise<BitcoinPriceData> => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return {
    price: data.bitcoin.usd,
    timestamp: new Date().toISOString(),
  };
};
