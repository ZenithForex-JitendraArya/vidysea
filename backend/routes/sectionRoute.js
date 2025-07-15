

import express from 'express';
import { getAllSections } from '../controllers/sectionController.js';

const sectionRouter = express.Router();

sectionRouter.get('/', getAllSections);

export default sectionRouter;
