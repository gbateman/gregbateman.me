const express = require('express')
  path = require('path');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/resume', (req, res) => res.sendFile(path.join(__dirname, 'resume.pdf')));

app.listen(PORT, () => console.log('Server running on port: ' + PORT));
