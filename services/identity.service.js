// This section of the code is responsible for managing user identities for all users in the application.
const mysql = require('mysql2');
const { admindb } = require('../config/config');

// Create pool for managing database connections (using promise wrapper)
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// This file contains the identity service functions for managing user identities.
// Function to register a new identity for a user
async function createIdentity(identityData) {
    // Vérification si email ou téléphone existe déjà
    const checkQuery = `SELECT * FROM identity WHERE email_admin = ? OR telephone_admin = ? AND del = 0`;
    const insertQuery = `INSERT INTO identity (nom_admin, prenom_admin, email_admin, telephone_admin, del) VALUES (?, ?, ?, ?, 0)`;

    try {
        // Vérification existence
        const [existing] = await pool.query(checkQuery, [identityData.email_admin, identityData.telephone_admin]);

        if (existing.length > 0) {
            // If found, return an error message
            console.log("[createIdentity] Identity already exists:", existing);
            return { error: "Cette identité existe déjà (email ou téléphone utilisé)" };
        }
        // If not found, insert the new identity
        console.log("[createIdentity] Identity data:", identityData);
        const [result] = await pool.query(insertQuery, [identityData.nom_admin, identityData.prenom_admin, identityData.email_admin, identityData.telephone_admin]);
        return { id: result.insertId, message: "Identité créée avec succès" };
    } catch (error) {
        console.error("[createIdentity] Error:", error);
        throw error;
    }
}


// Function to modify an existing identity
async function updateIdentity(id, identityData) {
    const query = `UPDATE identity SET nom_admin = ?, prenom_admin = ?, email_admin = ?, telephone_admin = ? WHERE id = ? AND del = 0`;
    try {
        const [result] = await pool.query(query, [identityData.nom_admin, identityData.prenom_admin, identityData.email_admin, identityData.telephone_admin, id]);
        // Nombre de lignes modifiées
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
}

// Function to delete an identity (soft delete)
async function deleteIdentity(id) {
    const query = `UPDATE identity SET del = 1 WHERE id = ?`;
    try {
        const [result] = await pool.query(query, [id]);
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
}

// Function to get an identity by ID (not used in the current controller)
async function getIdentityById(id) {
    const query = `SELECT * FROM identity WHERE id = ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [id]);
        return rows[0]; // Return the first row if found
    } catch (error) {
        throw error;
    }
}

// Fuction to get all identities (not used in the current controller)
async function getAllIdentities() {
    const query = `SELECT * FROM identity WHERE del = 0`;
    try {
        const [rows] = await pool.query(query);
        return rows; // Return all identities
    } catch (error) {
        throw error;
    }
}

// This section is for exporting the identity service functions
module.exports = {
    createIdentity,
    updateIdentity,
    deleteIdentity,
    getIdentityById,
    getAllIdentities
};