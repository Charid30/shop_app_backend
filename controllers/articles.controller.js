// This file is part of the articles controller for managing articles.
const articlesService = require('../services/articles.service');

// Function to handle the creation of a new article
async function createArticle(req, res) {
    try {
        const articleData = req.body;
        // Basic validation
        if (!articleData.nom_articles || !articleData.description_articles || !articleData.prix_articles || !articleData.stock_articles) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const result = await articlesService.createArticle(articleData);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.status(201).json({
            success: true,
            message: result.message,
            id: result.id
        });
    } catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to handle the modification of an existing article
async function modifyArticle(req, res) {
    try {
        const id = req.params.id; // The ID of the article to modify
        const articleData = req.body;

        // Basic validation
        if (!articleData.nom_articles || !articleData.description_articles || !articleData.prix_articles || !articleData.stock_articles) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const affectedRows = await articlesService.updateArticle(id, articleData);
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Article updated successfully',
            id: id
        });
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to handle the deletion of an article
async function deleteArticle(req, res) {
    try {
        const id = req.params.id; // The ID of the article to delete
        const affectedRows = await articlesService.deleteArticle(id);
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Article deleted successfully',
            id: id
        });
    } catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to get all articles with pagination
async function getArticlesWithPagination(req, res) {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const articles = await articlesService.getArticlesWithPagination(page, limit);
        res.status(200).json({
            success: true,
            data: articles
        });
    } catch (error) {
        console.error('Error fetching articles with pagination:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getAllArticles(req, res) {
    try {
        const articles = await articlesService.getAllArticles();
        res.status(200).json({
            success: true,
            data: articles
        });
    } catch (error) {
        console.error('Error fetching all articles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to get an article by ID
async function getArticleById(req, res) {
    try {
        const id = req.params.id; // The ID of the article to retrieve
        const article = await articlesService.getArticleById(id);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error) {
        console.error('Error fetching article by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Export the controller functions
module.exports = {
    createArticle,
    modifyArticle,
    deleteArticle,
    getArticlesWithPagination,
    getAllArticles,
    getArticleById
};