// This file contains the configuration settings for the application.
// It is used to set up environment variables, database connections, and other settings.

const userService = require('../../services/admin/user.service');

// Controller to create a new user_admin
async function createUser(req, res) {
    try {
        const userData = req.body;
        // Basic validation
        if (!userData.username_admin || !userData.password_admin) {
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
        if (!userData.username_admin || !userData.password_admin) {
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
            return res.status(400).json({ error: 'Username or password are wrong' });
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

// Reset user password by ID
async function changeUserPassword(req, res) {
    try {
        const result = await userService.changeUserPassword(req.params.id, req.body.newPassword);
        if (result === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.json({ message: "Mot de passe modifié avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Reset user password by username
async function resetUserPassword(req, res) {
    try {
        const { username_admin, newPassword } = req.body;
        const result = await userService.resetUserPassword(username_admin, newPassword);
        if (result === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.json({ message: "Mot de passe réinitialisé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get one user by username
async function getUserByUsername(req, res) {
    try {
        const user = await userService.getUserByUsername(req.params.username);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Pagination
async function getUsersWithPagination(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const users = await userService.getUsersWithPagination(limit, offset);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get all users number
async function getTotalUserCount(req, res) {
    try {
        const count = await userService.getTotalUserCount();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get users if username exists
async function doesUsernameExist(req, res) {
    try {
        const exists = await userService.doesUsernameExist(req.params.username);
        res.json({ exists });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get user by identity ID
async function getUserByIdentityId(req, res) {
    try {
        const users = await userService.getUserByIdentityId(req.params.identityId);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get users by role
async function getUsersByRole(req, res) {
    try {
        const users = await userService.getUsersByRole(req.params.role);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get users by field
async function getUsersByField(req, res) {
    try {
        const users = await userService.getUsersByField(req.params.field, req.params.value);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get users by status
async function getUsersByStatus(req, res) {
    try {
        const users = await userService.getUsersByStatus(req.params.status);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get users by date range
async function getUsersByDateRange(req, res) {
    try {
        const { startDate, endDate } = req.query;
        const users = await userService.getUsersByDateRange(startDate, endDate);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get users by permission
async function getUsersByPermission(req, res) {
    try {
        const users = await userService.getUsersByPermission(req.params.permission);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get users by attribute
async function getUsersByAttribute(req, res) {
    try {
        const users = await userService.getUsersByAttribute(req.params.attribute, req.params.value);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get users by tag
async function getUsersByTag(req, res) {
    try {
        const users = await userService.getUsersByTag(req.params.tag);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get users by role and status
async function getUsersByRoleAndStatus(req, res) {
    try {
        const users = await userService.getUsersByRoleAndStatus(req.params.role, req.params.status);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get users by role and attribute
async function getUsersByRoleAndAttribute(req, res) {
    try {
        const users = await userService.getUsersByRoleAndAttribute(req.params.role, req.params.attribute, req.params.value);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get users by role and tag
async function getUsersByRoleAndTag(req, res) {
    try {
        const users = await userService.getUsersByRoleAndTag(req.params.role, req.params.tag);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get users by status and attribute
async function getUsersByStatusAndAttribute(req, res) {
    try {
        const users = await userService.getUsersByStatusAndAttribute(req.params.status, req.params.attribute, req.params.value);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get users by status and tag
// This function retrieves users based on their status and a specific tag.
async function getUsersByStatusAndTag(req, res) {
    try {
        const users = await userService.getUsersByStatusAndTag(req.params.status, req.params.tag);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
    getAllUsersWithPagination,
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
// It is recommended to keep sensitive information out of version control.