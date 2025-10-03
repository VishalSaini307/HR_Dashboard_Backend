import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./Database/db.js";
import userRoutes from "./Authentication/user.routes.js";
import candidateRoutes from "./Module/Candidate/candidiate.routes.js";
import employeeLeaveRoutes from "./Module/EmployeeLeave/employeeleave.routes.js";
dotenv.config();
const app = express();
const isProd = process.env.NODE_ENV === 'production';
// In production, silence all console outputs to avoid noisy logs on Vercel
if (isProd) {
    ['log', 'info', 'warn', 'error', 'debug'].forEach((m) => { console[m] = () => { }; });
}
const allowedOrigins = [
    "http://localhost:5173",
    "https://hr-dashboard-backend-vishal.vercel.app",
    /\.vercel\.app$/ // ✅ regex for preview deployments
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) 
            return callback(null, true);
        if (allowedOrigins.some((o) => typeof o === "string" ? o === origin : o.test(origin))) {
            callback(null, true);
        } else {
            if (!isProd) console.log(`❌ CORS blocked for origin: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());
app.use(express.json());
app.use(express.static("public"));

// Quietly handle favicon requests to avoid noisy logs from clients requesting /favicon.ico or /favicon.png
app.get('/favicon.ico', (_req, res) => res.status(204).end());
app.get('/favicon.png', (_req, res) => res.status(204).end());
// ✅ Connect to DB
connectDB()
    .then(() => { if (!isProd) console.log("✅ Database connection established"); })
    .catch((err) => { if (!isProd) console.error("❌ Database connection failed:", err); });
// ✅ Routes
app.use("/api", userRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/employee-leaves", employeeLeaveRoutes);
// ✅ Root route
app.get("/", (_req, res) => {
    // in production keep response minimal
    res.send(isProd ? "OK" : "🚀 Server is running!");
});
// ✅ 404 handler
app.use((req, res) => {
    // avoid noisy 404 logs in production
    if (!isProd) res.status(404).send(`Not found: ${req.method} ${req.originalUrl}`);
    else res.status(404).end();
});
// ✅ Global error handler
app.use((err, req, res, _next) => {
    if (!isProd) console.error("Global error handler:", err);
    res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        // only include error message in non-prod to avoid leaking details
        error: isProd ? undefined : (err?.message || err)
    });
});
export default app;
