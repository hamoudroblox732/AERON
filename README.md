# AERON AI

AERON is a multilingual personal assistant app for iOS and iPadOS.

## Current foundation
- Expo + React Native + TypeScript
- Arabic, English, and Turkish interface
- Chat UI connected to a Supabase Edge Function client
- Server-side OpenAI Responses API integration
- Turkish vocabulary starter screen
- EAS build profiles for iOS/iPadOS

## Connect the AI backend

1. Create a Supabase project (or choose a project dedicated to AERON).
2. In Supabase project settings, copy the Project URL and anon/public key.
3. In the Supabase SQL/Edge Functions settings, deploy `supabase/functions/aeron-chat/index.ts` as a function named `aeron-chat`.
4. Add the provider key as a server secret named `OPENAI_API_KEY`. Never put this secret in this repository or in the app.
5. Set these public app environment variables in your build environment:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
6. Rebuild the app after setting the variables.

For local Expo testing, place the two public Supabase values in a local `.env` file. Do not commit that file.

## Important security notes
- The OpenAI key is read only by the Edge Function.
- The mobile app contains only the Supabase anon/public key; configure rate limits and abuse protection before public release.
- Do not store private API keys, service-role keys, passwords, or signing credentials in GitHub.

## Run
```bash
npm install
npx expo start
``

## Build iOS
Configure EAS and Apple signing credentials, then:
```bash
npx eas-cli build --platform ios --profile preview
``

## Not implemented yet
Voice input/output, persistent chat memory, web search, image understanding, and iOS Shortcuts integrations are next stages. iOS limits background listening and unrestricted device control.
