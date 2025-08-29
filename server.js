const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(".")) // Serve static files from current directory

// In-memory user storage (replace with database in production)
const users = []

// JWT secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production"

// Utility function to generate JWT token
const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "24h" })
}

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" })
    }
    req.user = user
    next()
  })
}

// Routes
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" })
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return res.status(409).json({ error: "User already exists with this email" })
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    // Generate JWT token
    const token = generateToken(newUser.id, newUser.email)

    // Return success response (don't send password)
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Find user
    const user = users.find((u) => u.email === email)
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email)

    // Return success response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api/profile", authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.userId)
  if (!user) {
    return res.status(404).json({ error: "User not found" })
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  })
})

// Protected routes that require authentication
app.get("/api/dashboard", authenticateToken, (req, res) => {
  res.json({
    message: "Welcome to your dashboard!",
    user: req.user,
    data: {
      stats: {
        totalLogins: 42,
        lastLogin: new Date().toISOString(),
      },
    },
  })
})

app.get("/api/settings", authenticateToken, (req, res) => {
  res.json({
    message: "User settings",
    user: req.user,
    settings: {
      theme: "dark",
      notifications: true,
      language: "en",
    },
  })
})

// Test endpoint that returns 401 without valid token
app.get("/api/protected-test", authenticateToken, (req, res) => {
  res.json({
    message: "This is a protected endpoint - you can only see this with a valid JWT token!",
    timestamp: new Date().toISOString(),
    user: req.user,
  })
})

// Other routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

module.exports = { app, authenticateToken, generateToken, users }
