import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/app.js";
import { connectDB } from "../src/Database/db.js";

let isDBConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Connect to MongoDB once
    if (!isDBConnected) {
      await connectDB();
      console.log("✅ MongoDB connected on Vercel");
      isDBConnected = true;
    }

    // Pass the request to Express
    app(req as any, res as any);
  } catch (err: any) {
    console.error("🔥 Vercel handler error:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message || err
    });
  }
}
