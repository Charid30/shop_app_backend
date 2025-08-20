// controllers/identity.controller.js
// This file contains the identity controller functions for managing user identities.
// This is the identity controller for the identity service file.
const identityService = require('../../services/admin/identity.service');

// Function to handle the creation of a new identity
async function createIdentity(req, res) {
    try {
        const identityData = req.body;
        // Basic validation
        if (!identityData.nom_admin || !identityData.prenom_admin || !identityData.email_admin || !identityData.telephone_admin) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const identityId = await identityService.createIdentity(identityData);
        res.status(201).json({
            success: true,
            message: 'Identity created successfully',
            id: identityId
        });
    } catch (error) {
        console.error('Error creating identity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to handle the modification of an identity
async function modifyIdentity(req, res) {
    try {
        const id = req.params.id; // L'identifiant de l'identity à modifier
        const identityData = req.body;

        // Basic validation
        if (!identityData.nom_admin || !identityData.prenom_admin || !identityData.email_admin || !identityData.telephone_admin) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const affectedRows = await identityService.updateIdentity(id, identityData);
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Identity not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Identity updated successfully',
            id: id
        });
    } catch (error) {
        console.error('Error updating identity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to handle the deletion of an identity
async function deleteIdentity(req, res) {
    try {
        // L'identifiant de l'identity à supprimer
        const id = req.params.id;
        const affectedRows = await identityService.deleteIdentity(id);
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Identity not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Identity deleted successfully',
            id: id
        });
    } catch (error) {
        console.error('Error deleting identity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to get an identity by ID (not used in the current controller)
async function getIdentityById(req, res) {
    try {
        const id = req.params.id; // L'identifiant de l'identity à récupérer
        const identity = await identityService.getIdentityById(id);
        if (!identity) {
            return res.status(404).json({ error: 'Identity not found' });
        }
        res.status(200).json(identity);
    } catch (error) {
        console.error('Error fetching identity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to get all identities (not used in the current controller)
async function getAllIdentities(req, res) {
    try {
        const identities = await identityService.getAllIdentities();
        res.status(200).json(identities);
    } catch (error) {
        console.error('Error fetching identities:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Export the controller functions
module.exports = {
    createIdentity,
    deleteIdentity,
    modifyIdentity,
    getIdentityById,
    getAllIdentities
};