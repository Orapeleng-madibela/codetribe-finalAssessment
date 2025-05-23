// Import required modules
const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const fs = require("fs")

// Create Express application
const app = express()

// Define port (use environment variable or default to 3000)
const PORT = process.env.PORT || 3000

// Middleware setup
app.use(bodyParser.json()) // Parse JSON request bodies
app.use(express.static(path.join(__dirname, "public"))) // Serve static files from 'public' directory

// Enable CORS for local development
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  if (req.method === "OPTIONS") {
    return res.sendStatus(200)
  }
  next()
})

// Store subscribers in a simple JSON file
const SUBSCRIBERS_FILE = path.join(__dirname, "subscribers.json")

// Initialize subscribers file if it doesn't exist
try {
  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([]))
    console.log("Created subscribers.json file")
  }
} catch (error) {
  console.error("Error creating subscribers file:", error)
}

// Helper function to read subscribers
function getSubscribers() {
  try {
    const data = fs.readFileSync(SUBSCRIBERS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading subscribers file:", error)
    return []
  }
}

// Helper function to save subscribers
function saveSubscribers(subscribers) {
  try {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2))
    return true
  } catch (error) {
    console.error("Error saving subscribers:", error)
    return false
  }
}

// API endpoint for newsletter subscription - support both paths
app.post(["/api/subscribe", "/subscribe"], (req, res) => {
  console.log("Received subscription request:", req.body)

  // Get email from request body
  const { email } = req.body

  // Validate email
  if (!email || !email.includes("@")) {
    console.log("Invalid email:", email)
    return res.status(400).json({
      success: false,
      message: "Invalid email address",
    })
  }

  try {
    // Get current subscribers
    const subscribers = getSubscribers()

    // Check if email already exists
    if (subscribers.some((sub) => sub.email === email)) {
      console.log("Email already subscribed:", email)
      return res.status(409).json({
        success: false,
        message: "You are already subscribed!",
      })
    }

    // Add new subscriber with timestamp
    subscribers.push({
      email,
      subscribedAt: new Date().toISOString(),
    })

    // Save updated subscribers list
    saveSubscribers(subscribers)

    // Log new subscription
    console.log("New subscriber added:", email)

    // Send success response
    res.status(200).json({
      success: true,
      message: "Subscription successful",
    })
  } catch (error) {
    console.error("Subscription error:", error)
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    })
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Open your browser and navigate to http://localhost:${PORT} to see the newsletter form`)
})
