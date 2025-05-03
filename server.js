const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/subscribe', (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  console.log('New subscriber:', email);
  res.json({ message: 'Subscription successful' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
