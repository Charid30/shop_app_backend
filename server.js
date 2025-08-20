require('dotenv').config();
const express = require('express');
const app = express();
const apiRouter = require('./router/apiRouter');

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use rootes
app.use('/api', apiRouter);

// This route can be used to check if the server is running
// and to provide a simple welcome message.
app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend!');
});

// 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// This middleware will catch any errors that occur in the application
// and respond with a 500 status code and an error message.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

// This will start the server on the port specified in the environment variable PORT or default to 3000.
// It will log a message to the console indicating that the server has started.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
module.exports = app; // Export the app for testing or further configuration
// This allows the server to be imported in other files, such as for testing purposes.
// End of recent edits