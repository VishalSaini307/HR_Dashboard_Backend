import 'dotenv/config';
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import passport from 'passport';
import { connectDB } from "./Database/db.js";
import userRoutes from "./Authentication/user.routes.js";
import { googleCallback } from "./Authentication/user.controller.js";
import candidateRoutes from "./Module/Candidate/candidiate.routes.js";
import employeeLeaveRoutes from "./Module/EmployeeLeave/employeeleave.routes.js";
import './Middleware/google.passport.js';
import { timeStamp } from 'console';



const app = express();

// ---------------------
// CORS setup
// ---------------------
const allowedOrigins = [
"http://localhost:5173",
  "https://hr-dashboard-frontend-five.vercel.app",
  /\.vercel\.app$/  // allow preview deployments
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // server-to-server requests (like Postman)

      console.log("🌍 Incoming Request Origin:", origin);

      const allowed = allowedOrigins.some((o) =>
        typeof o === "string" ? o === origin : o.test(origin)
      );

      if (allowed) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Preflight (OPTIONS) requests
app.options("*", cors());

// ---------------------
// Body parser
// ---------------------
app.use(passport.initialize());
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
app.use((req, res, next) => {
  if (req.method === "POST") {
    console.log("📨 POST Request Received:", req.method, req.url, req.body);
  }
  next();
});


// Add this middleware before your routes
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('📨 POST Request Received:', {
      method: req.method,
      url: req.url,
      path: req.path,
      body: req.body,
      origin: req.headers.origin,
      'content-type': req.headers['content-type']
    });
  }
  next();
});

// ---------------------
// Routes
// ---------------------
app.use("/api", userRoutes);

// Also accept OAuth callback at the root path used in Google Console
app.get('/auth/google/callback', passport.authenticate('google', { session: false }), googleCallback);

app.use("/api/candidates", candidateRoutes);
app.use("/api/employee-leaves", employeeLeaveRoutes);

// ---------------------
// Root route
// ---------------------
app.get("/", (_req, res) => {
  res.send("🚀 Server is running!");
});
app.get("/health", (req , res) =>{
  res.status(200).json({
    status: "Ok",
    server : "Running",
    database : "Connected",
    redis : "Connected",
    timeStamp : new Date()
  })
})
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
  console.error("🔥 Global error handler:", err);
  res.status(500).json({
    status: 500,
    message: "Internal Server Error",
    error: err?.message || err
  });
});

export default app;
