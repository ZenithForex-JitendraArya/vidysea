import pool from '../db.js';

export const getSubsectionsBySection = async (req, res) => {
    const { sectionId } = req.params;
    // Validate query param
    if (!sectionId) {
        return res.status(400).json({
            success: false,
            error: 'Missing section_id'
        });
    }
    try {
        const result = await pool.query(
            'SELECT * FROM subsections WHERE section_id = $1 ORDER BY id',
            [sectionId]
        );
        res.status(200).json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error('Error fetching subsections:', err);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
};
