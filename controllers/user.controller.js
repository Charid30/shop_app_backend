// This file contains the configuration settings for the application.
// It is used to set up environment variables, database connections, and other settings.

const userService = require('../services/user.service');

// Controller to create a new user_admin
async function createUser(req, res) {
    try {
        const userData = req.body;
        // Basic validation
        if (!userData.username_admin || !userData.password_admin || !userData.identity_ididentity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const userId = await userService.createUser(userData);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            id: userId
        });
    } catch (error) {
        console.error('Error creating user :', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Controller to modify an existing user_admin
async function modifyUser(req, res) {
    try {
        const id = req.params.id; // The ID of the user to modify
        const userData = req.body;

        // Basic validation
        if (!userData.username_admin || !userData.password_admin || !userData.identity_ididentity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const affectedRows = await userService.updateUser(id, userData);
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            id: id
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Controller to delete a user_admin
async function deleteUser(req, res) {
    try {
        const id = req.params.id; // The ID of the user to delete
        const affectedRows = await userService.deleteUser(id);
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            id: id
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Controller to get a user_admin by ID
async function getUserById(req, res) {
    try {
        const id = req.params.id; // The ID of the user to retrieve
        const user = await userService.getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Controller to get all user_admins
async function getAllUsers(req, res) {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Controller to get all users with pagination
async function getAllUsersWithPagination(req, res) {
    try {
        const page = parseInt(req.query.page) || 1; // Current page number
        const limit = parseInt(req.query.limit) || 10; // Number of users per page
        const offset = (page - 1) * limit; // Calculate offset for pagination

        const users = await userService.getAllUsersWithPagination(limit, offset);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving paginated users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Controller to authenticate a user_admin
async function authenticateUser(req, res) {
    try {
        const { username_admin, password_admin } = req.body;
        if (!username_admin || !password_admin) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        const user = await userService.authenticateUser(username_admin, password_admin);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.status(200).json({
            success: true,
            message: 'Authentication successful',
            user: user
        });
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Export the user controller functions
module.exports = {
    authenticateUser,
    createUser,
    modifyUser,
    deleteUser,
    getUserById,
    getAllUsers,
    getAllUsersWithPagination
};
// It is recommended to keep sensitive information out of version control.
