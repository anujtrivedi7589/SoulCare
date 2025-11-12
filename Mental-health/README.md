# Mental Health Wellness Platform

A comprehensive mental health and wellness application built with React, featuring mood tracking, journaling, exercises, and an AI-powered chatbot.

## Features

- Mood tracking with visualization
- Personal journal with sentiment analysis
- Guided breathing exercises
- AI-powered mental health chatbot (powered by Google Gemini)
- User profile management

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Gemini API Integration

This application uses Google's Gemini API for the AI chatbot feature. To enable this functionality:

1. Obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/)
2. Add the key to your `.env` file as `VITE_GEMINI_API_KEY`
3. The chatbot will automatically use the Gemini API for generating responses

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Previews the built app locally

## Technologies Used

- React 18 with Hooks
- Vite.js
- Framer Motion for animations
- React Router v6
- Chart.js for data visualization
- Lucide React for icons
- Google Gemini API for AI chatbot
- React Three Fiber for 3D visualizations