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
        const { sectionId, subSectionId, question, optionType, options } = req.body;

        console.log(' req.body.options:', options);
        console.log(' req.files:', req.files);

        // Validate required fields
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

        // Ensure options are properly shaped
        const preparedOptions = options.map(opt => ({
            text: opt.text,
            marks: opt.marks,
            image: null,
        }));
        console.log(preparedOptions)
        console.log(req.files)
        req.files.forEach(file => {
            const match = file.fieldname.match(/options\[(\d+)\]\[image\]/);
            console.log(match)
            if (match) {
                const idx = parseInt(match[1], 10);
                if (preparedOptions[idx]) {
                    preparedOptions[idx].image = file.filename;
                }
            }
        });
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const maxId = (await getMaxQuestionId()) + 1;

            await client.query(
                `INSERT INTO questions (id, section_id, subsection_id, question_text, option_type)
         VALUES ($1, $2, $3, $4, $5)`,
                [maxId, sectionId, subSectionId, question, optionType]
            );

            for (const option of preparedOptions) {
                await client.query(
                    `INSERT INTO options (question_id, text, marks, image_path)
           VALUES ($1, $2, $3, $4)`,
                    [maxId, option.text, option.marks, option.image]
                );
            }

            await client.query('COMMIT');

            res.status(201).json({
                success: true,
                message: 'Question created successfully',
                question_id: maxId,
            });
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('❌ DB transaction failed:', err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } finally {
            client.release();
        }

    } catch (err) {
        console.error('❌ createQuestion failed:', err);
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

export const getQuestionById = async (req, res) => {
    const { questionId } = req.params;
    console.log('Question ID:', questionId);

    // Example DB logic
    const client = await pool.connect();
    const questionQuery = `
      SELECT 
        q.id, 
        q.question_text, 
        q.option_type, 
        s.name as section_name,
        ss.name as subsection_name
      FROM questions q
      JOIN sections s ON q.section_id = s.id
      JOIN subsections ss ON q.subsection_id = ss.id
      WHERE q.id = $1
    `;
    const questionResult = await client.query(questionQuery, [questionId]);
    if (questionResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Question not found' });
    }
    const optionsResult = await client.query('SELECT * FROM options WHERE question_id = $1', [questionId]);

    res.json({
        success: true,
        data: {
            ...questionResult.rows[0],
            options: optionsResult.rows
        }
    });
};

