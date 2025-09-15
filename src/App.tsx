
import styled from 'styled-components'
import Text from './Text'

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
`

const Header = styled.header`
  margin-bottom: 3rem;
  text-align: center;
`

const Section = styled.section`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.primary[800]};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const Card = styled.div`
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary[700]};
`

function App() {
  return (
    <Container>
      <Header>
        <Text variant="h1" color="#00D2FF">E Pilot</Text>
        <Text variant="p1" color="#94A3B8">
          Advanced Crypto Trading Platform
        </Text>
      </Header>

      <Section>
        <Text variant="h2" color="#FFFFFF">Typography Showcase</Text>
        <Text variant="p1" color="#E2E8F0">
          Demonstrating our sophisticated midnight blue theme with modern typography.
        </Text>
      </Section>

      <Grid>
        <Card>
          <Text variant="h3" color="#5577FF">Primary Colors</Text>
          <Text variant="p2" color="#94A3B8">
            Our midnight blue palette creates a sophisticated, professional appearance perfect for financial applications.
          </Text>
        </Card>

        <Card>
          <Text variant="h3" color="#00FFA3">Success Metrics</Text>
          <Text variant="p2" color="#94A3B8">
            Positive indicators use vibrant green to communicate growth and profit clearly.
          </Text>
        </Card>

        <Card>
          <Text variant="h3" color="#00D2FF">Data Visualization</Text>
          <Text variant="p2" color="#94A3B8">
            Electric blue accents highlight important data points and interactive elements.
          </Text>
        </Card>
      </Grid>

      <Section>
        <Text variant="h4" color="#8B5CF6" uppercase>
          Premium Features
        </Text>
        <Text variant="p1" fontWeight={500} color="#E2E8F0">
          Experience sophisticated design that builds trust in crypto trading.
        </Text>
      </Section>
    </Container>
  )
}

export default App
