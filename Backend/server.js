const express = require('express');
const dotenv = require('dotenv'); // Import dotenv
const pool = require('./db'); // Import the MySQL connection pool
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customizationRoutes =require('./routes/customizationRoutes');
const customProduct = require('./routes/customProductRoutes')
const { authenticateToken } = require('./controllers/userController'); // Import authenticateToken
const cors = require('cors'); // Corrected the import of cors

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000; // Use environment port or default to 5000

// Enable CORS for all routes
// app.use(cors()); // Allow all origins by default, you can customize this if needed


app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Explicitly allow methods
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img'); // Save to public/img folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save with the original file name (e.g., sonu.png)
  }
});

// Initialize multer with the defined storage options
const upload = multer({ storage: storage });
// const upload = multer({ dest: 'uploads/' }); // Ensure file upload is handled
// Middleware to parse incoming JSON requests
app.use(express.json());

// Example route to test the database connection
app.get('/api/test', (req, res) => {
  pool.query('SELECT NOW()', (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Database error');
    }
    res.json({ message: 'Database connected successfully', time: results[0] });
  });
});

app.use(session({
  secret: process.env.SESSION_SECRET || "your_secret_key",  // Secret key for signing session ID
  resave: false,   // Prevents session from being saved back to store if not modified
  saveUninitialized: false,  // Don't create session until something is stored
  cookie: {
    secure: false,  // Set to true if using HTTPS
    httpOnly: true, // Prevents client-side JS from accessing cookie
    maxAge: 60 * 60 * 1000 // 1 hour
  }
}));

// Your other routes can go here...
app.use('/api/users', userRoutes);
app.use('/api/products', authenticateToken, productRoutes); // Use authenticateToken middleware here
app.use('/api/customize', authenticateToken, customizationRoutes );
app.use('/api/order', orderRoutes)
app.use('/api/customProduct', customProduct )
// app.use('/api/ingredient', authenticateToken, ingredientRoutes);
// app.use('/api/products', productRoutes);



app.use((req, res, next) => {
  console.log("Session Middleware:", req.session);
  next();
});

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
