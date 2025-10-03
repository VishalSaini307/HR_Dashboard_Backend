import app from "./app.js";
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

app.listen(PORT, () => {
    if (!isProd) console.log(`🚀 Server running at http://localhost:${PORT}`);
});
