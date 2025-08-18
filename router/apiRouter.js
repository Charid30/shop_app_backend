// ./router/apiRouter.js
const express = require('express');
const apiRouter = express.Router();

// Import controllers
const identityController = require('../controllers/identity.controller');
const userController = require('../controllers/user.controller');

// Identity routes
apiRouter.post('/identity', identityController.createIdentity);
apiRouter.put('/identity/:id', identityController.modifyIdentity);
apiRouter.delete('/identity/:id', identityController.deleteIdentity);
apiRouter.get('/identity/:id', identityController.getIdentityById);
apiRouter.get('/identity', identityController.getAllIdentities);

// User routes
apiRouter.post('/user', userController.createUser);
apiRouter.put('/user/:id', userController.modifyUser);
apiRouter.delete('/user/:id', userController.deleteUser);
apiRouter.get('/user/:id', userController.getUserById);
apiRouter.get('/user', userController.getAllUsers);

// Export the router
module.exports = apiRouter;