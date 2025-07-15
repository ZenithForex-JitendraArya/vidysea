// routes/subsectionRoute.js

import express from 'express';
import { getSubsectionsBySection } from '../controllers/subsectionController.js';

const router = express.Router();

router.get('/:sectionId', getSubsectionsBySection);

export default router;
