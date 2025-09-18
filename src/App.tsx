
import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import Text from './Text'
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

const SignInButton = styled.button`
  background: #4285f4;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.2s;

  &:hover {
    background: #3367d6;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`

const SignOutButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background: #c82333;
  }
`

const UserInfo = styled.div`
  text-align: center;
  background: ${({ theme }) => theme.colors.background.secondary};
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.primary[800]};
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
    return (
      <Container>
        <UserInfo>
          <Text variant="h2" color="#00D2FF">
            Welcome!
          </Text>
          <Text variant="p1" color="#E2E8F0">
            {authedUser.email}
          </Text>
          <SignOutButton onClick={handleSignOut}>
            Sign Out
          </SignOutButton>
        </UserInfo>
      </Container>
    )
  }

  return (
    <Container>
      <Text variant="h1" color="#00D2FF">
        E Pilot
      </Text>
      <SignInButton onClick={handleSignIn}>
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Sign in with Google
      </SignInButton>
    </Container>
  )
}

export default App
