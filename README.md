# E-Pilot - Bitcoin Price Guessing Game

A real-time Bitcoin price guessing game built with React, TypeScript, and Firebase. Players guess whether the Bitcoin price will go higher or lower within a 60-second window.

## Features

- 🔐 Google Authentication via Firebase
- 📈 Real-time Bitcoin price tracking
- 🎯 60-second prediction rounds
- 🏆 Score tracking system
- ⚡ Real-time updates every 5 seconds
- 📱 Responsive design with styled-components

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Styled-components
- **Authentication**: Firebase Auth (Google Sign-in)
- **Database**: Firebase Firestore
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: Yarn

## Prerequisites

- Node.js (version 18 or higher recommended)
- Yarn package manager
- Firebase project with authentication and Firestore enabled

## Quick Start

1. **Clone and install dependencies:**

   ```bash
   git clone https://github.com/romanstan1/bitcoin-guesser
   cd bitcoin-guesser
   yarn install
   ```

2. **Start the development server:**

   ```bash
   yarn dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build locally
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Fix ESLint errors automatically
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting

## Firebase Setup

The app is currently configured to use a specific Firebase project. If you want to use your own Firebase project:

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Google provider
3. Create a Firestore database
4. Update the Firebase config in `src/firebase.ts` with your project credentials

## Game Rules

1. **Sign In**: Use Google authentication to start playing
2. **Current Price**: See the current Bitcoin price displayed in real-time
3. **Make a Guess**: Choose whether the price will go "Higher" or "Lower"
4. **Wait**: After making a guess, wait 60 seconds for resolution
5. **Scoring**:
   - Correct guess: +1 point
   - Wrong guess: -1 point
6. **New Round**: Make another guess after the previous one resolves

## Project Structure

```
src/
├── components/          # React components
│   ├── GameButtons.tsx  # Higher/Lower guess buttons
│   ├── GameScreen.tsx   # Main game interface
│   ├── GuessStatus.tsx  # Current guess display
│   ├── LastUpdated.tsx  # Price update timestamp
│   ├── LoadingSkeleton.tsx
│   ├── LoginScreen.tsx  # Google sign-in interface
│   ├── styled.tsx       # Styled-components
│   └── Timestamp.tsx    # Time formatting utility
├── firebase.ts          # Firebase configuration
├── services.ts          # API calls and Firebase operations
├── theme.tsx           # Theme configuration
├── GlobalStyles.tsx    # Global CSS styles
└── App.tsx             # Main application component
```

## Deployment

The project includes Firebase hosting configuration:

```bash
# Build the project
yarn build

# Deploy to Firebase (requires Firebase CLI)
firebase deploy
```

## Development Notes

- Bitcoin prices are fetched from a real-time API every 5 seconds
- User data and scores are stored in Firebase Firestore
- The app uses Firebase authentication for user management
- Guess resolution happens automatically after 60 seconds
- All styling is done with styled-components
