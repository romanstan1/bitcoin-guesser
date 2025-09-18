import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Text from "./components/Text";
import LoginScreen from "./components/LoginScreen";
import GameScreen from "./components/GameScreen";
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
`;

function App() {
  const [authedUser, setAuthedUser] = useState<AuthUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bitcoinPrice, setBitcoinPrice] = useState<BitcoinPriceData | null>(
    null
  );
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [hasResolvedGuess, setHasResolvedGuess] = useState(false);

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
      // show error to user
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
    }, 10000); // refresh every 5 seconds

    return () => clearInterval(interval);
  }, [authedUser, handleFetchBitcoinPrice]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Failed to sign in:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
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

  const handleResolveGuess = useCallback(async () => {
    try {
      if (!authedUser || !user || hasResolvedGuess) return false;

      const bitcoinData = await fetchBitcoinPrice();
      const guess = user?.guess;

      if (guess === null) return false;

      let score = user?.score || 0;
      const priceAtLastGuess = user?.priceAtLastGuess || 0;

      if (bitcoinData.price === priceAtLastGuess) {
        // Do nothing intentionally. this will need to refetch the price and check again.
        return;
      }

      setHasResolvedGuess(true);

      if (guess === "higher" && bitcoinData.price > priceAtLastGuess) {
        score += 1;
      } else {
        score -= 1;
      }

      if (guess === "lower" && bitcoinData.price < priceAtLastGuess) {
        score += 1;
      } else {
        score -= 1;
      }

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

      return true;
    } catch (error) {
      console.error("Error resolving guess:", error);
      return false;
    }
  }, [user, authedUser, hasResolvedGuess]);

  // Timer logic for guess resolution
  useEffect(() => {
    if (!user?.lastGuessTime) {
      setSecondsElapsed(0);
      setHasResolvedGuess(false);
      return;
    }

    const updateTimer = () => {
      const guessDate = new Date(user.lastGuessTime!);
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - guessDate.getTime()) / 1000);
      setSecondsElapsed(elapsed);

      // Trigger resolve after 60 seconds
      if (elapsed >= 60 && !hasResolvedGuess) {
        handleResolveGuess();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [user?.lastGuessTime, hasResolvedGuess, handleResolveGuess]);

  if (loading) {
    return (
      <Container>
        <Text variant="p1" color="#94A3B8">
          Loading...
        </Text>
      </Container>
    );
  }

  if (authedUser && user) {
    return (
      <GameScreen
        authedUser={authedUser}
        user={user}
        onSignOut={handleSignOut}
        bitcoinPrice={bitcoinPrice}
        onMakeGuess={handleMakeGuess}
        secondsElapsed={secondsElapsed}
      />
    );
  }

  return <LoginScreen onSignIn={handleSignIn} />;
}

export default App;
