# MediaPipe Pose Landmarker

Interactive web application using MediaPipe for real-time pose, face, and hand tracking with an engaging catch-the-object game.

**Live Demo:** [https://mediapipe-pose-landmaker.vercel.app/](https://mediapipe-pose-landmaker.vercel.app/)

## Features

- 🎯 **Real-time Pose Detection** - Track body landmarks and movements
- 👤 **Face Landmarking** - Detect facial features with optional segmentation mask
- ✋ **Hand Tracking** - Track hand movements for interactive gameplay
- 🎮 **Catch Game** - Catch falling food emojis using your hands
- 📊 **Score Counter** - Track your catch count in real-time

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Material UI** - Component library
- **MediaPipe Tasks Vision** - AI-powered pose, face, and hand detection

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## How to Play

1. Click "Start tracking" to enable your camera
2. Wait for MediaPipe models to load
3. Food emojis will appear randomly on screen
4. Use your hands to catch them before they disappear
5. Watch your score increase with each catch!

---

