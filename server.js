// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON in request bodies
app.use(express.json());

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// ------------- GAME STATE (in-memory) ----------------
let gameState = {
  teamAChoice: null,  // The name of the person Team A chose
  teamBChoice: null,  // The name of the person Team B chose
  currentTurn: 'A',   // Which team’s turn it is - 'A' or 'B'
};

// Helper to shuffle an array in-place (Fisher-Yates)
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ---------------- ROUTES ----------------

// 1) Return a *random* selection of 25 photos
app.get('/api/photos', (req, res) => {
  const photosDir = path.join(__dirname, 'public', 'photos');

  fs.readdir(photosDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to fetch photos' });
    }

    // Filter out hidden/system files
    let photoNames = files.filter(f => !f.startsWith('.'));

    // Shuffle the array of filenames
    shuffleArray(photoNames);

    // Take only the first 25 after shuffling
    const selectedPhotos = photoNames.slice(0, 25);

    return res.json(selectedPhotos);
  });
});

// 2) Set a team’s choice
app.post('/api/choose', (req, res) => {
  // Expect { team: 'A' or 'B', choice: 'PersonName.jpg' }
  const { team, choice } = req.body;

  if (team === 'A') {
    gameState.teamAChoice = choice;
  } else if (team === 'B') {
    gameState.teamBChoice = choice;
  } else {
    return res.status(400).json({ error: 'Invalid team' });
  }

  return res.json({ message: 'Choice registered', gameState });
});

// 3) Fetch current game state
app.get('/api/state', (req, res) => {
  res.json(gameState);
});

// 4) Switch turns between Team A / Team B
app.post('/api/next-turn', (req, res) => {
  gameState.currentTurn = gameState.currentTurn === 'A' ? 'B' : 'A';
  res.json({ message: 'Turn switched', currentTurn: gameState.currentTurn });
});

// ------------- START SERVER -------------
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});