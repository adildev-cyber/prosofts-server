const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Data sementara. Nanti bisa pake database
let players = [];
let leaderboard = [];

app.use(cors());
app.use(express.json());

// 1. TEST SERVER
app.get('/', (req, res) => {
  res.json({ status: "Server ULTRA BEAR ADVENTURE Online", version: "1.0" });
});

// 2. LOGIN / REGISTER
app.post('/api/login', (req, res) => {
  const { username, deviceId } = req.body;
  
  let player = players.find(p => p.deviceId === deviceId);
  
  if (!player) {
    player = {
      id: Date.now(),
      username: username || "Player" + Date.now(),
      deviceId: deviceId,
      coins: 100,
      highScore: 0
    };
    players.push(player);
  }
  
  res.json({ success: true, player: player });
});

// 3. SIMPAN SCORE
app.post('/api/saveScore', (req, res) => {
  const { deviceId, score, coins } = req.body;
  
  let player = players.find(p => p.deviceId === deviceId);
  if (player) {
    if (score > player.highScore) player.highScore = score;
    player.coins += coins || 0;
    
    // Update leaderboard
    leaderboard = players.sort((a,b) => b.highScore - a.highScore).slice(0, 10);
  }
  
  res.json({ success: true, player: player });
});

// 4. AMBIL LEADERBOARD
app.get('/api/leaderboard', (req, res) => {
  res.json({ success: true, leaderboard: leaderboard });
});

// 5. AMBIL DATA PLAYER
app.get('/api/player/:deviceId', (req, res) => {
  const player = players.find(p => p.deviceId === req.params.deviceId);
  res.json({ success: true, player: player });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
