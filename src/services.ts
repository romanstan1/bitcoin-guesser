import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as AuthUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase";

export type Guess = "higher" | "lower";

export type User = {
  score: number;
  priceAtLastGuess: number | null;
  lastGuessTime: string | null;
  guess: Guess | null;
};

export const getUserRef = (userId: string) => {
  return doc(db, "users", userId);
};

export const createUser = async (userId: string) => {
  const userRef = getUserRef(userId);
  try {
    await setDoc(userRef, {
      score: 0,
      priceAtLastGuess: null,
      lastGuessTime: null,
      guess: null,
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

export const updateUser = async (userId: string, data: User) => {
  const userRef = getUserRef(userId);
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
    "https://api.coinbase.com/v2/exchange-rates?currency=BTC"
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return {
    price: parseFloat(data.data.rates.USD),
    timestamp: new Date().toISOString(),
  };
};
