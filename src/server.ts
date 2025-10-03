import app from './app.js'; // relative import with .js
import serverless from 'serverless-http';

export const handler = serverless(app);
