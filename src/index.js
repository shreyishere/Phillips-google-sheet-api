require('dotenv').config({ path: './config/.env' }); // Load .env from the config folder
const express = require('express');
const sheetRoutes = require('../routes/sheetRoutes'); // Import routes
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON
app.use('/sheet', sheetRoutes); // Use sheet routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});