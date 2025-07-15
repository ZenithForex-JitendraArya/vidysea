// routes/questionsRoute.js   ✅ Better name!

import express from 'express';
import multer from 'multer';
import { createQuestion, getLastFiveQuestions, getQuestionById } from '../controllers/questionController.js';

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });
router.post('/', upload.any(), createQuestion);
router.get('/', getLastFiveQuestions);
router.get('/:questionId', getQuestionById);

export default router;
