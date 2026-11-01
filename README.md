# AERON AI

AERON is a multilingual personal assistant app for iOS and iPadOS.

## Languages
- Arabic
- English
- Turkish learning support

## Current foundation
- Expo + React Native + TypeScript
- Dark AERON interface with cyan accents
- Language selector
- Starter chat interface (local demo only)
- Turkish vocabulary starter screen
- EAS Build profiles for iOS

## Not connected yet
AI responses, speech recognition, text-to-speech, persistent memory, web search, and iOS Shortcuts integrations will be added in later stages.

Never commit private API keys, Supabase service-role keys, passwords, or signing credentials.

## Start locally
```bash
npm install
npx expo start
``

## Build iOS
Configure EAS and the required Apple signing credentials, then run:
```bash
npx eas-cli build --platform ios --profile preview
``
