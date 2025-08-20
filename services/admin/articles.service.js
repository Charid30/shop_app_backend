// Attribut of the articles db
// nom_articles, description_articles,prix_articles, stock_articles, del

// This code is part of the articles service file.
const mysql = require('mysql2');
const { admindb } = require('../../config/config');

// This file contains the service functions for managing articles in the admin database.
// Function to create a new article
async function createArticle(articleData) {
    const checkQuery = `SELECT * FROM articles WHERE nom_articles = ? AND del = 0`;
    const insertQuery = `INSERT INTO articles (nom_articles, description_articles, prix_articles, stock_articles, del) VALUES (?, ?, ?, ?, 0)`;

    try {
        // Check if the article already exists
        const [existing] = await admindb.query(checkQuery, [articleData.nom_articles]);
        if (existing.length > 0) {
            console.log("[createArticle] Article already exists:", existing);
            return { error: "Cet article existe déjà" };
        }
        // Insert the new article
        const [result] = await admindb.query(insertQuery, [articleData.nom_articles, articleData.description_articles, articleData.prix_articles, articleData.stock_articles]);
        return { id: result.insertId, message: "Article créé avec succès" };
    } catch (error) {
        console.error("[createArticle] Error:", error);
        throw error;
    }
}

// Function to update an existing article
async function updateArticle(id, articleData) {
    const query = `UPDATE articles SET nom_articles = ?, description_articles = ?, prix_articles = ?, stock_articles = ? WHERE id = ? AND del = 0`;
    try {
        const [result] = await admindb.query(query, [articleData.nom_articles, articleData.description_articles, articleData.prix_articles, articleData.stock_articles, id]);
        return result.affectedRows; // Return the number of affected rows
    } catch (error) {
        console.error("[updateArticle] Error:", error);
        throw error;
    }
}

// Function to delete an article (soft delete)
async function deleteArticle(id) {
    const query = `UPDATE articles SET del = 1 WHERE id = ?`;
    try {
        const [result] = await admindb.query(query, [id]);
        return result.affectedRows; // Return the number of affected rows
    } catch (error) {
        console.error("[deleteArticle] Error:", error);
        throw error;
    }
}

// Function to get all articles
async function getAllArticles() {
    const query = `SELECT * FROM articles WHERE del = 0`;
    try {
        const [rows] = await admindb.query(query);
        return rows; // Return the list of articles
    } catch (error) {
        console.error("[getAllArticles] Error:", error);
        throw error;
    }
}

// Function to get an article by ID
async function getArticleById(id) {
    const query = `SELECT * FROM articles WHERE id = ? AND del = 0`;
    try {
        const [rows] = await admindb.query(query, [id]);
        return rows[0]; // Return the first row if found
    } catch (error) {
        console.error("[getArticleById] Error:", error);
        throw error;
    }
}

// Function to get articles with pagination
async function getArticlesWithPagination(page, limit) {
    const offset = (page - 1) * limit;
    const query = `SELECT * FROM articles WHERE del = 0 LIMIT ? OFFSET ?`;
    try {
        const [rows] = await admindb.query(query, [limit, offset]);
        return rows; // Return the paginated articles
    } catch (error) {
        console.error("[getArticlesWithPagination] Error:", error);
        throw error;
    }
}

// Export the article service functions
module.exports = {
    createArticle,
    updateArticle,
    deleteArticle,
    getAllArticles,
    getArticleById,
    getArticlesWithPagination
};