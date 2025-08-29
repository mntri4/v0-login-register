# JWT Authentication App

A complete login/register application with JWT authentication, built with vanilla JavaScript frontend and Express.js backend.

## Features

- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Protected API endpoints
- Responsive frontend design
- Token persistence with localStorage
- Real-time form validation

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set environment variables:**
   Create a `.env` file in the root directory:
   \`\`\`env
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3000
   \`\`\`

3. **Start the server:**
   \`\`\`bash
   npm start
   # or for development with auto-reload:
   npm run dev
   \`\`\`

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## API Endpoints

### Authentication Endpoints

#### POST `/api/register`
Register a new user account.

**Request Body:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
\`\`\`

**Success Response (201):**
\`\`\`json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
\`\`\`

**Error Responses:**
- `400` - Missing required fields
- `409` - User already exists
- `500` - Internal server error

#### POST `/api/login`
Authenticate an existing user.

**Request Body:**
\`\`\`json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
\`\`\`

**Success Response (200):**
\`\`\`json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
\`\`\`

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `500` - Internal server error

### Protected Endpoints

All protected endpoints require a valid JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

#### GET `/api/profile`
Get current user profile information.

**Success Response (200):**
\`\`\`json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
\`\`\`

#### GET `/api/dashboard`
Get dashboard data for authenticated user.

**Success Response (200):**
\`\`\`json
{
  "message": "Welcome to your dashboard!",
  "user": {
    "userId": 1,
    "email": "john@example.com"
  },
  "data": {
    "stats": {
      "totalLogins": 42,
      "lastLogin": "2024-01-15T10:30:00.000Z"
    }
  }
}
\`\`\`

#### GET `/api/settings`
Get user settings.

**Success Response (200):**
\`\`\`json
{
  "message": "User settings",
  "user": {
    "userId": 1,
    "email": "john@example.com"
  },
  "settings": {
    "theme": "dark",
    "notifications": true,
    "language": "en"
  }
}
\`\`\`

#### GET `/api/protected-test`
Test endpoint to verify JWT authentication.

**Success Response (200):**
\`\`\`json
{
  "message": "This is a protected endpoint - you can only see this with a valid JWT token!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "user": {
    "userId": 1,
    "email": "john@example.com"
  }
}
\`\`\`

### Error Responses for Protected Endpoints

- `401` - No token provided or token missing
- `403` - Invalid or expired token
- `404` - User not found

## Frontend Usage

The frontend automatically handles:
- Form switching between login and register modes
- JWT token storage in localStorage
- Authentication state persistence
- API error handling and user feedback
- Protected endpoint testing

### Key Frontend Methods

- `login()` - Authenticate user and store token
- `register()` - Create new account and store token
- `logout()` - Clear stored token and reload page
- `testProtectedEndpoint()` - Test API call with stored token
- `checkAuthStatus()` - Verify existing authentication on page load

## Security Features

- **Password Hashing:** All passwords are hashed using bcrypt with 10 salt rounds
- **JWT Tokens:** Secure token-based authentication with 24-hour expiration
- **Input Validation:** Server-side validation for all user inputs
- **Error Handling:** Secure error messages that don't leak sensitive information
- **CORS Protection:** Configured for cross-origin requests

## File Structure

\`\`\`
├── server.js          # Express server with API endpoints
├── index.html         # Frontend HTML structure
├── styles.css         # Frontend styling
├── script.js          # Frontend JavaScript logic
├── package.json       # Node.js dependencies
├── .env              # Environment variables (create this)
└── README.md         # This documentation
\`\`\`

## Development Notes

- **Database:** Currently uses in-memory storage. Replace with a real database (MongoDB, PostgreSQL, etc.) for production
- **Environment Variables:** Always use strong, unique JWT secrets in production
- **HTTPS:** Use HTTPS in production for secure token transmission
- **Rate Limiting:** Consider adding rate limiting for authentication endpoints
- **Password Requirements:** Implement stronger password validation as needed

## Testing the API

You can test the API endpoints using curl:

\`\`\`bash
# Register a new user
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Access protected endpoint (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer TOKEN"
\`\`\`

## License

MIT License - feel free to use this code for your projects.
