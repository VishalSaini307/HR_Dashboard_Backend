// Import the compiled app from dist (project lives under src). Vercel runs the build
// so dist/src/app.js will be present in the deployment. This avoids importing
// TypeScript source at runtime.
import app from "../dist/src/app.js";

const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

app.listen(PORT, () => {
    if (!isProd) console.log(`🚀 Server running at http://localhost:${PORT}`);
});
