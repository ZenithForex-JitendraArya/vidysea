
import pool from '../db.js';  // ✅ use `import` for your db connection


export const getAllSections = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sections ORDER BY id');
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error('Error fetching sections:', err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
};

