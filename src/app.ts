import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./Database/db.js";
import userRoutes from "./Authentication/user.routes.js";
import candidateRoutes from "./Module/Candidate/candidiate.routes.js";
import employeeLeaveRoutes from "./Module/EmployeeLeave/employeeleave.routes.js";

dotenv.config();

const app = express();

// ---------------------
// CORS setup
// ---------------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://hr-dashboard-frontend-five.vercel.app/",
  "https://hr-dashboard-backend-vishal.vercel.app",
  /\.vercel\.app$/ // allow all vercel preview deployments
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server-to-server requests

      const allowed = allowedOrigins.some((o) =>
        typeof o === "string" ? o === origin : o.test(origin)
      );

      if (allowed) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.options("*", cors());

// ---------------------
// Body parser
// ---------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------
// Static files
// ---------------------
app.use(express.static("public"));

// ---------------------
// Middleware to ensure DB connection
// ---------------------
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await connectDB(); // connect DB on first request
    next();
  } catch (err) {
    next(err);
  }
});

// ---------------------
// Routes
// ---------------------
app.use("/api", userRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/employee-leaves", employeeLeaveRoutes);

// ---------------------
// Root route
// ---------------------
app.get("/", (_req, res) => {
  res.send("🚀 Server is running!");
});

// ---------------------
// 404 handler
// ---------------------
app.use((req: Request, res: Response) => {
  res.status(404).send(`Not found: ${req.method} ${req.originalUrl}`);
});

// ---------------------
// Global error handler
// ---------------------
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    status: 500,
    message: "Internal Server Error",
    error: err?.message || err
  });
});

export default app;
