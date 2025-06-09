import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { RateLimiterMemory } from "rate-limiter-flexible";
import chatRoutes from "./routes/chat.js";
import { initializeXMTPClient, ensureGlobalGroup } from "./services/xmtpService.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  keyFunc: (req) => req.ip,
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 1000 || 900, // Convert to seconds
});

app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
    res.set("Retry-After", String(secs));
    res.status(429).json({
      error: "Too Many Requests",
      message: `Rate limit exceeded. Try again in ${secs} seconds.`,
    });
  }
});

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || "1.0.0",
  });
});

// API routes
app.use("/api/v1/chat", chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(isDevelopment && { stack: err.stack }),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Initialize XMTP and start server
async function startServer() {
  try {
    console.log("🚀 Starting Public Square Backend...");

    // Initialize XMTP client
    console.log("📡 Initializing XMTP client...");
    await initializeXMTPClient();

    // Ensure global group exists
    console.log("🌍 Ensuring global group exists...");
    await ensureGlobalGroup();

    // Start the server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔐 XMTP Environment: ${process.env.XMTP_ENV}`);
      console.log(`🎯 API Base: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("📴 SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("📴 SIGINT received, shutting down gracefully...");
  process.exit(0);
});

// Start the server
startServer();
