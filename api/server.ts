import app from '../src/app.js'; // import the Express app from src with .js extension
import serverless from 'serverless-http';

// Vercel expects the default export to be a function or server.
// Export the serverless handler as default so the platform can invoke it.
export default serverless(app);