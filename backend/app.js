import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

import sectionRouter from './routes/sectionRoute.js';
import subsectionsRoutes from './routes/subsectionRoute.js';
import questionsRoutes from './routes/questionsRoutes.js';

// Load environment variables
dotenv.config();

// App config
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({}));

// DB connection test
pool.connect().then(() => console.log("🟢 PostgreSQL connected"))
.catch(err => console.error("🔴 DB connection error", err));

// Routes
app.use("/api/section", sectionRouter)
app.use('/api/subsection', subsectionsRoutes);
app.use('/api/question', questionsRoutes);
app.use('/uploads', express.static('uploads'));
// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
