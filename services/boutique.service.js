// This code is part of the boutique service file.
const mysql = require('mysql2');
const { admindb } = require('../config/config');
// Create a pool for managing database connections
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// Function to create a new boutique
async function createBoutique(boutiqueData) {
    const checkQuery = `SELECT * FROM boutique WHERE nom_boutique = ? AND del = 0`;
    const insertQuery = `INSERT INTO boutique (nom_boutique, adresse_boutique, telephone_boutique, del) VALUES (?, ?, ?, 0)`;

    try {
        // Check if the boutique already exists
        const [existing] = await pool.query(checkQuery, [boutiqueData.nom_boutique]);
        if (existing.length > 0) {
            console.log("[createBoutique] Boutique already exists:", existing);
            return { error: "Cette boutique existe déjà" };
        }
        // Insert the new boutique
        const [result] = await pool.query(insertQuery, [boutiqueData.nom_boutique, boutiqueData.adresse_boutique, boutiqueData.telephone_boutique]);
        return { id: result.insertId, message: "Boutique créée avec succès" };
    } catch (error) {
        console.error("[createBoutique] Error:", error);
        throw error;
    }
}

// Function to update an existing boutique
async function updateBoutique(id, boutiqueData) {
    const query = `UPDATE boutique SET nom_boutique = ?, adresse_boutique = ?, telephone_boutique = ? WHERE id = ? AND del = 0`;
    try {
        const [result] = await pool.query(query, [boutiqueData.nom_boutique, boutiqueData.adresse_boutique, boutiqueData.telephone_boutique, id]);
        return result.affectedRows; // Return the number of affected rows
    } catch (error) {
        console.error("[updateBoutique] Error:", error);
        throw error;
    }
}

// Function to delete a boutique (soft delete)
async function deleteBoutique(id) {
    const query = `UPDATE boutique SET del = 1 WHERE id = ?`;
    try {
        const [result] = await pool.query(query, [id]);
        return result.affectedRows; // Return the number of affected rows
    } catch (error) {
        console.error("[deleteBoutique] Error:", error);
        throw error;
    }
}

// Function to get all boutiques
async function getAllBoutiques() {
    const query = `SELECT * FROM boutique WHERE del = 0`;
    try {
        const [rows] = await pool.query(query);
        return rows; // Return all boutiques
    } catch (error) {
        console.error("[getAllBoutiques] Error:", error);
        throw error;
    }
}

// Function to get a boutique by ID
async function getBoutiqueById(id) {
    const query = `SELECT * FROM boutique WHERE id = ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [id]);
        return rows[0]; // Return the first row if found
    } catch (error) {
        console.error("[getBoutiqueById] Error:", error);
        throw error;
    }
}

// Function to get boutiques with pagination
async function getBoutiquesWithPagination(page, limit) {
    const offset = (page - 1) * limit;
    const query = `SELECT * FROM boutique WHERE del = 0 LIMIT ? OFFSET ?`;
    try {
        const [rows] = await pool.query(query, [limit, offset]);
        return rows; // Return the paginated boutiques
    } catch (error) {
        console.error("[getBoutiquesWithPagination] Error:", error);
        throw error;
    }
}

// Export the boutique service functions
module.exports = {
    createBoutique,
    updateBoutique,
    deleteBoutique,
    getAllBoutiques,
    getBoutiqueById,
    getBoutiquesWithPagination
};