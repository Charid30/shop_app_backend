// This file contains the role controller for managing roles in the application.
const roleService = require('../services/role.service');
// Function to handle the creation of a new role
async function createRole(req, res) {
    try {
        const roleData = req.body;
        // Basic validation
        if (!roleData.nom_role || !roleData.acronyme_role) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const roleId = await roleService.createRole(roleData);
        res.status(201).json({
            success: true,
            message: 'Role created successfully',
            id: roleId
        });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to handle the modification of an existing role
async function modifyRole(req, res) {
    try {
        const id = req.params.id; // The ID of the role to modify
        const roleData = req.body;

        // Basic validation
        if (!roleData.nom_role || !roleData.acronyme_role) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const affectedRows = await roleService.updateRole(id, roleData);
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Role not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Role updated successfully',
            id: id
        });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to handle the deletion of a role
async function deleteRole(req, res) {
    try {
        const id = req.params.id; // The ID of the role to delete
        const affectedRows = await roleService.deleteRole(id);
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Role not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Role deleted successfully',
            id: id
        });
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to get a role by ID
async function getRoleById(req, res) {
    try {
        const id = req.params.id; // The ID of the role to retrieve
        const role = await roleService.getRoleById(id);
        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }
        res.status(200).json(role);
    } catch (error) {
        console.error('Error retrieving role:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to get all roles
async function getAllRoles(req, res) {
    try {
        const roles = await roleService.getAllRoles();
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Exporting the role controller functions
module.exports = {
    createRole,
    modifyRole,
    deleteRole,
    getRoleById,
    getAllRoles
};