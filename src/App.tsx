import { useState, useEffect, useCallback } from "react";
import LoginScreen from "./components/LoginScreen";
import GameScreen from "./components/GameScreen";
import SuccessModal from "./components/SuccessModal";
import {
  signInWithGoogle,
  signOut,
  onAuthStateChange,
  getUser,
  createUser,
  fetchBitcoinPrice,
  updateUser,
  type Guess,
} from "./services";
import { type User as AuthUser } from "firebase/auth";
import { type User, type BitcoinPriceData } from "./services";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { type ModalData } from "./components/SuccessModal";

export const SECONDS_TO_RESOLVE_GUESS = 10;

function App() {
  const [authedUser, setAuthedUser] = useState<AuthUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bitcoinPrice, setBitcoinPrice] = useState<BitcoinPriceData | null>(
    null
  );
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [hasResolvedGuess, setHasResolvedGuess] = useState(false);
  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    guess: "higher",
    pointsChange: 0,
  });

  const handleFetchBitcoinPrice = useCallback(async () => {
    try {
      const priceData = await fetchBitcoinPrice();
      setBitcoinPrice(priceData);
    } catch (error) {
      console.error("Failed to fetch Bitcoin price:", error);
      // do nothing
    }
  }, []);

  const handleCreateUser = useCallback(async (authUser: AuthUser) => {
    const res = await createUser(authUser.uid);
    if (!res) {
      // todo: show error to user
      return;
    }
    const userData = await getUser(authUser.uid);
    setUser(userData);
  }, []);

  const handleUserChange = useCallback(
    async (authUser: AuthUser) => {
      const userData = await getUser(authUser.uid);

      if (!userData) {
        handleCreateUser(authUser);
      } else {
        setUser(userData);
      }
    },
    [handleCreateUser]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChange((authUser) => {
      setAuthedUser(authUser);

      if (authUser) {
        handleUserChange(authUser);
        handleFetchBitcoinPrice();
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [handleUserChange, handleFetchBitcoinPrice]);

  useEffect(() => {
    if (!authedUser) return;

    const interval = setInterval(() => {
      handleFetchBitcoinPrice();
    }, 5000); // refresh every 5 seconds

    return () => clearInterval(interval);
  }, [authedUser, handleFetchBitcoinPrice]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      // todo: show error to user
      console.error("Failed to sign in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      // todo: show error to user
      console.error("Failed to sign out:", error);
    }
  };

  const handleMakeGuess = useCallback(
    async (guess: Guess) => {
      if (!authedUser || !user) return false;

      try {
        // Fetch latest bitcoin price
        const bitcoinData = await fetchBitcoinPrice();

        // Update user data with new guess data
        const updatedUserData: User = {
          ...user,
          priceAtLastGuess: bitcoinData.price,
          lastGuessTime: bitcoinData.timestamp,
          guess: guess,
        };

        await updateUser(authedUser.uid, updatedUserData);
        setUser(updatedUserData);
        setSecondsElapsed(0);
        setHasResolvedGuess(false);
        return true;
      } catch (error) {
        console.error("Error making guess:", error);
        return false;
      }
    },
    [authedUser, user]
  );

  const handleCloseModal = useCallback(() => {
    setModalData((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleResolveGuess = useCallback(async () => {
    try {
      if (!authedUser || !user || hasResolvedGuess) return false;

      const bitcoinData = await fetchBitcoinPrice();
      const guess = user?.guess;

      if (guess === null) return false;

      const priceAtLastGuess = user?.priceAtLastGuess || 0;

      if (bitcoinData.price === priceAtLastGuess) {
        // Do nothing intentionally. this will need to refetch the price and check again.
        return;
      }

      let pointsChange = 0;
      let actualGuess: Guess | null = null;

      if (guess === "higher") {
        if (bitcoinData.price > priceAtLastGuess) {
          pointsChange = 1;
          actualGuess = "higher";
        } else {
          pointsChange = -1;
          actualGuess = "lower";
        }
      }

      if (guess === "lower") {
        if (bitcoinData.price < priceAtLastGuess) {
          pointsChange = 1;
          actualGuess = "lower";
        } else {
          pointsChange = -1;
          actualGuess = "higher";
        }
      }

      const score = (user?.score || 0) + pointsChange;

      setHasResolvedGuess(true);

      // Show the modal with result
      setModalData({
        isOpen: true,
        guess: actualGuess!,
        pointsChange,
      });

      // Update user data with new guess data
      const updatedUserData: User = {
        ...user,
        priceAtLastGuess: null,
        lastGuessTime: null,
        guess: null,
        score: score || 0,
      };

      await updateUser(authedUser.uid, updatedUserData);
      setUser(updatedUserData);
      setSecondsElapsed(0);
    } catch (error) {
      console.error("Error resolving guess:", error);
    }
  }, [user, authedUser, hasResolvedGuess]);

  // Timer logic for guess resolution
  useEffect(() => {
    if (!user?.lastGuessTime) {
      setSecondsElapsed(0);
      setHasResolvedGuess(false);
      return;
    }

    const guessTimestamp = new Date(user.lastGuessTime).getTime();

    const updateTimer = () => {
      // Use cached timestamp
      const elapsed = Math.floor((Date.now() - guessTimestamp) / 1000);
      setSecondsElapsed(elapsed);

      // Trigger resolve after 60 seconds
      if (elapsed >= SECONDS_TO_RESOLVE_GUESS && !hasResolvedGuess) {
        handleResolveGuess();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [user?.lastGuessTime, hasResolvedGuess, handleResolveGuess]);

  // Auto-close modal after 4 seconds
  useEffect(() => {
    if (modalData.isOpen) {
      const timer = setTimeout(() => {
        handleCloseModal();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [modalData.isOpen, handleCloseModal]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (authedUser && user) {
    return (
      <>
        <GameScreen
          authedUser={authedUser}
          user={user}
          onSignOut={handleSignOut}
          bitcoinPrice={bitcoinPrice}
          onMakeGuess={handleMakeGuess}
          secondsElapsed={secondsElapsed}
        />
        <SuccessModal
          isOpen={modalData.isOpen}
          onClose={handleCloseModal}
          guess={modalData.guess}
          pointsChange={modalData.pointsChange}
        />
      </>
    );
  }

  return <LoginScreen onSignIn={handleSignIn} />;
}

export default App;
