import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// const pool = new Pool({
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE,
//     port: parseInt(process.env.DATABASEPORT),
// });
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    //for live
    ssl: {
        rejectUnauthorized: false,
    },
});


export default pool; 
