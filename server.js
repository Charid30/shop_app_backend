require('dotenv').config();
const express = require('express');
const app = express();
const apiRouter = require('./router/apiRouter');

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Use rootes
app.use('/api', apiRouter);

// Route racine
app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend!');
});

// 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});