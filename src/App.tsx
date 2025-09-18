
import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import Text from './Text'
import LoginScreen from './LoginScreen'
import GameScreen from './GameScreen'
import { signInWithGoogle, signOut, onAuthStateChange, getUser, createUser } from './services'
import { type User as AuthUser } from 'firebase/auth'
import { type User } from './services'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
`

function App() {
  const [authedUser, setAuthedUser] = useState<AuthUser | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)


  const handleCreateUser = useCallback(async (authUser: AuthUser) => {
    const res = await createUser(authUser.uid)
    if(!res){
      // show error to user
      return;
    }
    const userData = await getUser(authUser.uid)
    setUser(userData)
  }, [])


  const handleUserChange = useCallback(async (authUser: AuthUser) => {
    const userData = await getUser(authUser.uid)

    if(!userData) {
      handleCreateUser(authUser)
    } else {
      setUser(userData)
    }

  }, [handleCreateUser])

  useEffect(() => {
    const unsubscribe = onAuthStateChange((authUser) => {
      setAuthedUser(authUser)

      if(authUser) {
        handleUserChange(authUser)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [handleUserChange])

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Failed to sign in:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  if (loading) {
    return (
      <Container>
        <Text variant="p1" color="#94A3B8">Loading...</Text>
      </Container>
    )
  }

  if (authedUser) {
    return <GameScreen user={authedUser} onSignOut={handleSignOut} />
  }

  return <LoginScreen onSignIn={handleSignIn} />
}

export default App
