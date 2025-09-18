import styled from 'styled-components'
import Text from './Text'
import { type User as AuthUser } from 'firebase/auth'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
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

interface GameScreenProps {
  user: AuthUser
  onSignOut: () => void
}

function GameScreen({ user, onSignOut }: GameScreenProps) {
  return (
    <Container>
      <UserInfo>
        <Text variant="h2" color="#00D2FF">
          Welcome!
        </Text>
        <Text variant="p1" color="#E2E8F0">
          {user.email}
        </Text>
        <SignOutButton onClick={onSignOut}>
          Sign Out
        </SignOutButton>
      </UserInfo>
    </Container>
  )
}

export default GameScreen
