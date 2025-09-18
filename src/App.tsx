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

        // Update user data with new guess info
        const updatedUserData: User = {
          ...user,
          priceAtLastGuess: bitcoinData.price,
          lastGuessTime: bitcoinData.timestamp,
          guess: guess,
        };

        await updateUser(authedUser.uid, updatedUserData);

        setUser(updatedUserData);

        return true;
      } catch (error) {
        console.error("Error making guess:", error);
        return false;
      }
    },
    [authedUser, user]
  );

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
      />
    );
  }

  return <LoginScreen onSignIn={handleSignIn} />;
}

export default App;
