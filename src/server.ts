import app from "./app.js";
import { connectDB } from "./Database/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();  // ✅ connect once before server starts
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1); // exit if DB not connected
  }
};

startServer();