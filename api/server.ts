import app from '../src/app.js'; // import the Express app from src with .js extension
import serverless from 'serverless-http';

export const handler = serverless(app);