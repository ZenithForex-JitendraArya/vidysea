// controllers/questionController.js

import pool from '../db.js';

// export const createQuestion = async (req, res) => {
//     const { sectionId, subSectionId, question, optionType, options } = req.body;
//     console.log(req.body);

//     if (!sectionId || !subSectionId || !question || !optionType || !Array.isArray(options)) {
//         return res.status(400).json({ success: false, message: 'Missing required fields' });
//     }

//     const client = await pool.connect();

//     try {
//         await client.query('BEGIN');

//         // Insert the question
//         const maxId =await getMaxQuestionId() + 1;
//         const result = await client.query(
//             `INSERT INTO questions (id,section_id, subsection_id, question_text, option_type)
//        VALUES ($1, $2, $3, $4,$5)`,
//             [maxId, sectionId, subSectionId, question, optionType]
//         );
//         // Insert options
//         for (const option of options) {
//             await client.query(
//                 `INSERT INTO options (question_id, text, marks)
//          VALUES ($1, $2, $3)`,
//                 [maxId, option.text, (option.marks+0)]
//             );
//         }

//         await client.query('COMMIT');

//         res.status(201).json({
//             success: true,
//             message: 'Question created successfully',
//             question_id: maxId
//         });

//     } catch (err) {
//         await client.query('ROLLBACK');
//         console.error('Error creating question:', err);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     } finally {
//         client.release();
//     }
// };


export const createQuestion = async (req, res) => {
    try {
        const { sectionId, subSectionId, question, optionType } = req.body;
        console.log('req.body:', req.body);
        console.log('req.files:', req.files);
        let options = [];
        let i = 0;
        while (req.body[`options[${i}][text]`]) {
            options.push({
                text: req.body[`options[${i}][text]`],
                marks: req.body[`options[${i}][marks]`],
                image: null,
            });
            i++;
        }
        // match uploaded files:
        req.files.forEach(file => {
            const match = file.fieldname.match(/options\[(\d+)\]\[image\]/);
            if (match) {
                const idx = parseInt(match[1], 10);
                if (options[idx]) {
                    options[idx].image = file.filename;
                }
            }
        });
        if (
            !sectionId ||
            !subSectionId ||
            !question ||
            !optionType ||
            !Array.isArray(options) ||
            options.length === 0
        ) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // ✅ DB
        const client = await pool.connect();
        await client.query('BEGIN');
        const maxId = (await getMaxQuestionId()) + 1;
        await client.query(
            `INSERT INTO questions (id, section_id, subsection_id, question_text, option_type)
            VALUES ($1, $2, $3, $4, $5)`,
            [maxId, sectionId, subSectionId, question, optionType]
        );
        for (const option of options) {
            await client.query(`INSERT INTO options (question_id, text, marks, image)
            VALUES ($1, $2, $3, $4)`,
                [maxId, option.text, option.marks, option.image]);
        }
        await client.query('COMMIT');
        res.status(201).json({
            success: true,
            message: 'Question created successfully',
            question_id: maxId,
        });
    } catch (err) {
        console.error('Error creating question:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const getMaxQuestionId = async () => {
    try {
        const result = await pool.query('SELECT MAX(id) AS max_id FROM questions');
        const maxId = result.rows[0].max_id;
        return maxId;

    } catch (err) {
        console.error('Error fetching max question id:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getLastFiveQuestions = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, question_text, option_type
       FROM questions
       ORDER BY id DESC
       LIMIT 5`
        );

        res.status(200).json({
            success: true,
            data: result.rows,
        });

    } catch (err) {
        console.error('Error fetching last 5 questions:', err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};
