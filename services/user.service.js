// This is the user service file for handling user-related operations for authentication and user management.
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
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
});

// Function to create a new user
async function createUser(userData) {
    const query = `INSERT INTO user_admin (username_admin, password_admin, del, identity_ididentity) VALUES (?, ?, 0, ?)`;
    try {
        // Password hashing
        const hashedPassword = await bcrypt.hash(userData.password_admin, 12);
        const [result] = await pool.query(query, [userData.username_admin, hashedPassword, userData.identity_ididentity]);
        // Return the ID of the newly created user
        return result.insertId;
    } catch (error) {
        throw error;
    }
}

// Function to update an existing user
async function updateUser(id, userData) {
    const query = `UPDATE user_admin SET username_admin = ?, password_admin = ? WHERE id = ? AND del = 0`;
    try {
        // Password hashing
        const hashedPassword = await bcrypt.hash(userData.password_admin, 12);
        const [result] = await pool.query(query, [userData.username_admin, hashedPassword, id]);
        // Return the number of affected rows
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
}

// Function to delete a user (soft delete)
async function deleteUser(id) {
    const query = `UPDATE user_admin SET del = 1 WHERE id = ?`;
    try {
        const [result] = await pool.query(query, [id]);
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
}

// Function to get a user by ID (not used in the current controller)
async function getUserById(id) {
    const query = `SELECT * FROM user_admin WHERE id = ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [id]);
        return rows[0]; // Return the first row if found
    } catch (error) {
        throw error;
    }
}

// Function to get all users (not used in the current controller)
async function getAllUsers() {
    const query = `SELECT * FROM user_admin WHERE del = 0`;
    try {
        const [rows] = await pool.query(query);
        return rows; // Return all users
    } catch (error) {
        throw error;
    }
}

// Function to authenticate a user
async function authenticateUser(username, password) {
    const query = `SELECT * FROM user_admin WHERE username_admin = ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [username]);
        if (rows.length === 0) {
            throw new Error('User not found');
        }
        const user = rows[0];
        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password_admin);
        if (!isMatch) {
            throw new Error('Invalid password');
        }
        return user; // Return the authenticated user
    } catch (error) {
        throw error;
    }
}

// Function to change a user's password
async function changeUserPassword(id, newPassword) {
    const query = `UPDATE user_admin SET password_admin = ? WHERE id = ? AND del = 0`;
    try {
        // Password hashing
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const [result] = await pool.query(query, [hashedPassword, id]);
        // Return the number of affected rows
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
}

// Function to reset a user's password
async function resetUserPassword(username, newPassword) {
    const query = `UPDATE user_admin SET password_admin = ? WHERE username_admin = ? AND del = 0`;
    try {
        // Password hashing
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const [result] = await pool.query(query, [hashedPassword, username]);
        // Return the number of affected rows
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
}

// Function to get a user by username (not used in the current controller)
async function getUserByUsername(username) {
    const query = `SELECT * FROM user_admin WHERE username_admin = ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [username]);
        return rows[0]; // Return the first row if found
    } catch (error) {
        throw error;
    }
}

// Function to get all users with pagination (not used in the current controller)
async function getUsersWithPagination(limit, offset) {
    const query = `SELECT * FROM user_admin WHERE del = 0 LIMIT ? OFFSET ?`;
    try {
        const [rows] = await pool.query(query, [limit, offset]);
        return rows; // Return the paginated users
    } catch (error) {
        throw error;
    }
}

// Function to get the total count of users (not used in the current controller)
async function getTotalUserCount() {
    const query = `SELECT COUNT(*) AS count FROM user_admin WHERE del = 0`;
    try {
        const [rows] = await pool.query(query);
        return rows[0].count; // Return the total count of users
    } catch (error) {
        throw error;
    }
}

// Function to check if a username already exists (not used in the current controller)
async function doesUsernameExist(username) {
    const query = `SELECT COUNT(*) AS count FROM user_admin WHERE username_admin = ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [username]);
        return rows[0].count > 0; // Return true if the username exists
    } catch (error) {
        throw error;
    }
}

// Function to get a user by identity ID (not used in the current controller)
async function getUserByIdentityId(identityId) {
    const query = `SELECT * FROM user_admin WHERE identity_ididentity = ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [identityId]);
        return rows; // Return the users associated with the given identity ID
    } catch (error) {
        throw error;
    }
}

// Function to get all users with a specific role (not used in the current controller)
async function getUsersByRole(role) {
    const query = `SELECT * FROM user_admin WHERE role = ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [role]);
        return rows; // Return the users with the specified role
    } catch (error) {
        throw error;
    }
}

// Function to get users by a specific field (not used in the current controller)
async function getUsersByField(field, value) {
    const query = `SELECT * FROM user_admin WHERE ?? = ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [field, value]);
        return rows; // Return the users matching the specified field and value
    } catch (error) {
        throw error;
    }
}

// Function to get users with a specific status (not used in the current controller)
async function getUsersByStatus(status) {
    const query = `SELECT * FROM user_admin WHERE status = ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [status]);
        return rows; // Return the users with the specified status
    } catch (error) {
        throw error;
    }
}

// Function to get users created within a specific date range (not used in the current controller)
async function getUsersByDateRange(startDate, endDate) {
    const query = `SELECT * FROM user_admin WHERE created_at BETWEEN ? AND ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [startDate, endDate]);
        return rows; // Return the users created within the specified date range
    } catch (error) {
        throw error;
    }
}

// Function to get users with a specific permission (not used in the current controller)
async function getUsersByPermission(permission) {
    const query = `SELECT * FROM user_admin WHERE permissions LIKE ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [`%${permission}%`]);
        return rows; // Return the users with the specified permission
    } catch (error) {
        throw error;
    }
}

// Function to get users with a specific attribute (not used in the current controller)
async function getUsersByAttribute(attribute, value) {
    const query = `SELECT * FROM user_admin WHERE ?? = ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [attribute, value]);
        return rows; // Return the users matching the specified attribute and value
    } catch (error) {
        throw error;
    }
}

// Function to get users with a specific tag (not used in the current controller)
async function getUsersByTag(tag) {
    const query = `SELECT * FROM user_admin WHERE tags LIKE ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [`%${tag}%`]);
        return rows; // Return the users with the specified tag
    } catch (error) {
        throw error;
    }
}

// Function to get users with a specific role and status (not used in the current controller)
async function getUsersByRoleAndStatus(role, status) {
    const query = `SELECT * FROM user_admin WHERE role = ? AND status = ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [role, status]);
        return rows; // Return the users with the specified role and status
    } catch (error) {
        throw error;
    }
}

// Function to get users with a specific role and attribute (not used in the current controller)
async function getUsersByRoleAndAttribute(role, attribute, value) {
    const query = `SELECT * FROM user_admin WHERE role = ? AND ?? = ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [role, attribute, value]);
        return rows; // Return the users with the specified role and attribute
    } catch (error) {
        throw error;
    }
}

// Function to get users with a specific role and tag (not used in the current controller)
async function getUsersByRoleAndTag(role, tag) {
    const query = `SELECT * FROM user_admin WHERE role = ? AND tags LIKE ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [role, `%${tag}%`]);
        return rows; // Return the users with the specified role and tag
    } catch (error) {
        throw error;
    }
}

// Function to get users with a specific status and attribute (not used in the current controller)
async function getUsersByStatusAndAttribute(status, attribute, value) {
    const query = `SELECT * FROM user_admin WHERE status = ? AND ?? = ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [status, attribute, value]);
        return rows; // Return the users with the specified status and attribute
    } catch (error) {
        throw error;
    }
}

// Function to get users with a specific status and tag (not used in the current controller)
async function getUsersByStatusAndTag(status, tag) {
    const query = `SELECT * FROM user_admin WHERE status = ? AND tags LIKE ? AND del = 0`;
    try {
        const [rows] = await pool.query(query, [status, `%${tag}%`]);
        return rows; // Return the users with the specified status and tag
    } catch (error) {
        throw error;
    }
}

// Function exporting the user service functions
module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    getAllUsers,
    authenticateUser,
    changeUserPassword,
    resetUserPassword,
    getUserByUsername,
    getUsersWithPagination,
    getTotalUserCount,
    doesUsernameExist,
    getUserByIdentityId,
    getUsersByRole,
    getUsersByField,
    getUsersByStatus,
    getUsersByDateRange,
    getUsersByPermission,
    getUsersByAttribute,
    getUsersByTag,
    getUsersByRoleAndStatus,
    getUsersByRoleAndAttribute,
    getUsersByRoleAndTag,
    getUsersByStatusAndAttribute,
    getUsersByStatusAndTag
};