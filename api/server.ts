import app from './app.js'; // always use relative path with .js
import serverless from 'serverless-http';

export const handler = serverless(app);