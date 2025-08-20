// router/apiRouter.js
const express = require('express');
const apiRouter = express.Router();

//------------------------------------> Import controllers <------------------------------------//
const identityController = require('../controllers/admin/identity.controller');
const userController = require('../controllers/admin/user.controller');
const roleController = require('../controllers/admin/role.controller');
const articlesController = require('../controllers/admin/articles.controller');
const boutiqueController = require('../controllers/admin/boutique.controller');


//------------------------------------> Identity routes <------------------------------------//
apiRouter.post('/identity', identityController.createIdentity);
apiRouter.put('/identity/:id', identityController.modifyIdentity);
apiRouter.delete('/identity/:id', identityController.deleteIdentity);
apiRouter.get('/identity/:id', identityController.getIdentityById);
apiRouter.get('/identity', identityController.getAllIdentities);

//------------------------------------> User routes <------------------------------------//
apiRouter.post('/user', userController.createUser);
apiRouter.put('/user/:id', userController.modifyUser);
apiRouter.delete('/user/:id', userController.deleteUser);
apiRouter.get('/user/:id', userController.getUserById);
apiRouter.get('/user', userController.getAllUsers);

//------------------------------------> Role routes <------------------------------------//
apiRouter.post('/role', roleController.createRole);
apiRouter.put('/role/:id', roleController.modifyRole);
apiRouter.delete('/role/:id', roleController.deleteRole);
apiRouter.get('/role/:id', roleController.getRoleById);
apiRouter.get('/role', roleController.getAllRoles);

//------------------------------------> Boutique routes <------------------------------------//
apiRouter.post('/boutique', boutiqueController.createBoutique);
apiRouter.put('/boutique/:id', boutiqueController.modifyBoutique);
apiRouter.delete('/boutique/:id', boutiqueController.deleteBoutique);
apiRouter.get('/boutique/:id', boutiqueController.getBoutiqueById);
apiRouter.get('/boutique', boutiqueController.getAllBoutiques);
apiRouter.get('/boutique/paginate', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const boutiques = await boutiqueController.getBoutiquesWithPagination(page, limit);
        res.status(200).json({
            success: true,
            data: boutiques
        });
    } catch (error) {
        console.error('Error fetching paginated boutiques:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//--------------------------------------> Articles routes <--------------------------------------//
apiRouter.post('/articles', articlesController.createArticle);
apiRouter.put('/articles/:id', articlesController.modifyArticle);
apiRouter.delete('/articles/:id', articlesController.deleteArticle);
apiRouter.get('/articles', articlesController.getAllArticles);
apiRouter.get('/articles/paginate', articlesController.getArticlesWithPagination);


//-------------------------------------> Export the router <-------------------------------------//
module.exports = apiRouter;