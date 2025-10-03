import app from "./app.js";

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    }
  });
}

export default app;
