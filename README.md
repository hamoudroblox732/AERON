# AERON

AERON is a multilingual personal assistant app for iOS and iPadOS, built with React Native and TypeScript.

## Features
- Arabic, English, and Turkish interface
- AI chat through a Supabase Edge Function and OpenAI Responses API
- Local chat and language preferences
- Turkish vocabulary with translated meanings and speech playback
- Turkish quiz with 10 questions, saved progress, scoring, and reset
- Suggested prompts, retry after a failed response, and chat controls
- Dark interface with tablet layout support

## Backend configuration

The mobile app calls the Supabase Edge Function:

`https://cezeunjaurhfdevuaidp.supabase.co/functions/v1/aeron-chat`

The app uses the Supabase anon/public key. This key is intended for client use; access must be protected with appropriate Supabase policies and backend controls.

The Edge Function reads the OpenAI key from the server-side secret named exactly:

`openai_api_key`

Never put the OpenAI API key or a Supabase service-role key in this repository or in the mobile app.

To deploy or update the function, use the source at:

`supabase/functions/aeron-chat/index.ts`

## Local development

```bash
npm install
npm run typecheck
npx expo start
```

There is no committed lockfile currently, so `npm install` resolves dependency versions from the ranges in `package.json`.

## Data and privacy notes
- Chat history, selected language, and quiz progress are stored locally on the device using AsyncStorage.
- Clearing app data or uninstalling the app may remove this local information.
- AI chat requests are sent to the configured Supabase Edge Function, which forwards the conversation to the OpenAI API.
- Do not send passwords, API keys, or other sensitive information in chat.

## Current limitations
- This repository update has not been verified by a full device build or live AI request.
- Speech availability and voice quality depend on the device's installed speech voices.
- The app does not provide unrestricted control of iOS or background listening.
