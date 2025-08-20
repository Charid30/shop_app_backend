// This is the role service file for managing user roles in the application.
const db = require('../config/config'); // Import the database configuration
const mysql = require('mysql2');

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

// Function to create a new role
async function createRole(roleData) {
    // Vérifier si le rôle existe déjà
    const checkQuery = `SELECT * FROM role WHERE nom_role = ? OR acronyme_role = ? AND del = 0`;
    try {
        const [rows] = await pool.query(checkQuery, [roleData.nom_role, roleData.acronyme_role]);
        if (rows.length > 0) {
            // Log the existing role data for debugging
            console.log("[createRole] Role already exists:", rows);
            console.log("[createRole] Role already exists:", roleData);
            // Retourner un message d'erreur ou un objet indiquant que le rôle existe déjà
            return { success: false, message: "Le rôle existe déjà !" };
        }
        // Sinon on l'insère
        const insertQuery = `INSERT INTO role (nom_role, acronyme_role, del) VALUES (?, ?, 0)`;
        const [result] = await pool.query(insertQuery, [roleData.nom_role, roleData.acronyme_role]);
        return { success: true, insertId: result.insertId, message: "Rôle créé avec succès !" };
    } catch (error) {
        console.error("[createRole] Error:", error);
        throw error;
    }
}

// Function to update an existing role
async function updateRole(id, roleData) {
    const query = `UPDATE role SET nom_role = ?, acronyme_role = ? WHERE id = ?`;
    console.log("[updateRole] ID:", id, "Data:", roleData);

    try {
        const [result] = await pool.query(query, [roleData.nom_role, roleData.acronyme_role, id]);
        console.log("[updateRole] Update result:", result);
        return result.affectedRows; // Return the number of affected rows
    } catch (error) {
        console.error("[updateRole] Error:", error);
        throw error;
    }
}

// Function to delete a role (soft delete)
async function deleteRole(id) {
    const query = `UPDATE role SET del = 1 WHERE id = ?`;
    console.log("[deleteRole] ID:", id);

    try {
        const [result] = await pool.query(query, [id]);
        console.log("[deleteRole] Delete result:", result);
        return result.affectedRows;
    } catch (error) {
        console.error("[deleteRole] Error:", error);
        throw error;
    }
}

// Function to get a role by ID
async function getRoleById(id) {
    const query = `SELECT * FROM role WHERE id = ? AND del = 0`;
    console.log("[getRoleById] ID:", id);

    try {
        const [rows] = await pool.query(query, [id]);
        console.log("[getRoleById] Rows:", rows);
        return rows[0];
    } catch (error) {
        console.error("[getRoleById] Error:", error);
        throw error;
    }
}

// Function to get all roles
async function getAllRoles() {
    const query = `SELECT * FROM role WHERE del = 0`;
    console.log("[getAllRoles] Fetching all roles...");

    try {
        const [rows] = await pool.query(query);
        console.log("[getAllRoles] Rows fetched:", rows.length);
        return rows;
    } catch (error) {
        console.error("[getAllRoles] Error:", error);
        throw error;
    }
}

// Export the role service functions
module.exports = {
    createRole,
    updateRole,
    deleteRole,
    getRoleById,
    getAllRoles
};