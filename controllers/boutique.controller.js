// This file is part of the boutique controller for managing boutiques.
const boutiqueService = require('../services/boutique.service');

// Function to handle the creation of a new boutique
async function createBoutique(req, res) {
    try {
        const boutiqueData = req.body;
        // Basic validation
        if (!boutiqueData.nom_boutique || !boutiqueData.adresse_boutique || !boutiqueData.telephone_boutique) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const result = await boutiqueService.createBoutique(boutiqueData);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.status(201).json({
            success: true,
            message: result.message,
            id: result.id
        });
    } catch (error) {
        console.error('Error creating boutique:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to handle the modification of an existing boutique
async function modifyBoutique(req, res) {
    try {
        const id = req.params.id; // The ID of the boutique to modify
        const boutiqueData = req.body;

        // Basic validation
        if (!boutiqueData.nom_boutique || !boutiqueData.adresse_boutique || !boutiqueData.telephone_boutique) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const affectedRows = await boutiqueService.updateBoutique(id, boutiqueData);
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Boutique not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Boutique updated successfully',
            id: id
        });
    } catch (error) {
        console.error('Error updating boutique:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getBoutiquesWithPagination(req, res) {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const boutiques = await boutiqueService.getBoutiquesWithPagination(page, limit);
        res.status(200).json({
            success: true,
            data: boutiques
        });
    } catch (error) {
        console.error('Error fetching boutiques with pagination:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to handle the deletion of a boutique
async function deleteBoutique(req, res) {
    try {
        const id = req.params.id; // The ID of the boutique to delete
        const affectedRows = await boutiqueService.deleteBoutique(id);
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Boutique not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Boutique deleted successfully',
            id: id
        });
    } catch (error) {
        console.error('Error deleting boutique:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to get all boutiques
async function getAllBoutiques(req, res) {
    try {
        const boutiques = await boutiqueService.getAllBoutiques();
        res.status(200).json({
            success: true,
            data: boutiques
        });
    } catch (error) {
        console.error('Error fetching all boutiques:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getBoutiqueById(req, res) {
    try {
        const id = req.params.id; // The ID of the boutique to retrieve
        const boutique = await boutiqueService.getBoutiqueById(id);
        if (!boutique) {
            return res.status(404).json({ error: 'Boutique not found' });
        }
        res.status(200).json({
            success: true,
            data: boutique
        });
    } catch (error) {
        console.error('Error fetching boutique by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

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

// Export the functions to be used in routes
module.exports = {
    createBoutique,
    modifyBoutique,
    deleteBoutique,
    getAllBoutiques,
    getBoutiqueById,
    getBoutiquesWithPagination
};