# TOEFL Listening Prep AI 🎧

An adaptive TOEFL iBT Listening Section practice tool with AI-powered features and high-quality text-to-speech.

## 🌐 Live Demo

Visit: **https://[your-username].github.io/toefl-listening-prep-ai/**

## ✨ Features

- **2026 Adaptive Format**: Simulates the new TOEFL iBT adaptive test structure
  - Module 1: Routing (determines your level)
  - Module 2: Adaptive difficulty based on Module 1 performance
- **High-Quality TTS**: Uses Microsoft Edge Neural voices for authentic American accents
- **Real-time Timer**: Section timer that pauses during audio playback
- **Scratchpad**: Built-in note-taking area for practice
- **Detailed Analysis**: Review answers with explanations and transcripts

## 🚀 Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open <http://localhost:3000> in your browser.

### With Enhanced TTS (Recommended)

For the best audio quality with authentic American accents:

```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start Edge TTS server
cd server
pip install edge-tts
python3 tts_server.py
```

## 🔧 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **TTS**: Microsoft Edge Neural Voices (via edge-tts)

## 📦 Deployment

The app automatically deploys to GitHub Pages on push to `main` branch.

To deploy manually:

```bash
npm run build
```

## 📝 License

MIT License
