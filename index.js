require('dotenv').config(); // Add dotenv for environment variables
const express = require('express');
const { google } = require('googleapis');
const app = express();

// Replace with your own values
const PORT = process.env.PORT || 3000;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID; // Use environment variable
const SHEET_NAME = process.env.SHEET_NAME || 'Sheet1'; // Use environment variable or default

// Configure GoogleAuth with environment variables for service account credentials
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: process.env.GOOGLE_TYPE,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle newline characters
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

// GET endpoint to read data from the Google Sheet
app.get('/sheet', async (req, res) => {
  try {
    // Get an authorized client
    const client = await auth.getClient();
    // Create an instance of the Google Sheets API
    const sheets = google.sheets({ version: 'v4', auth: client });
    // Fetch a range of values (you can adjust the range as needed)
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:Z1000`
    });
    // Send the result as JSON
    res.json(result.data);
  } catch (error) {
    console.error('Error reading sheet:', error);
    res.status(500).json({ error: error.message });
  }
});

// Example: POST endpoint to append a row to the Google Sheet
app.use(express.json());
app.post('/sheet', async (req, res) => {
  try {
    const rowData = req.body; // Expect data as an array, e.g. ["1011", "Alice", "Cooper", "alice.cooper@example.com", "Engineering", "Developer", "2023-07-10", "555-2341", "San Francisco", "92000"]
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:Z1`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData]
      }
    });
    res.json(result.data);
  } catch (error) {
    console.error('Error appending row:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/sheet/:row', async (req, res) => {
  try {
    const rowNumber = req.params.row; // The row number to update
    const rowData = req.body; // Expecting the new row data as an array
    if (!Array.isArray(rowData)) {
      return res.status(400).json({ error: 'Row data must be provided as an array' });
    }

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    // Define the range to update. For instance, here we're targeting columns A to J (10 columns).
    const range = `${SHEET_NAME}!A${rowNumber}:J${rowNumber}`;
    const result = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
      valueInputOption: 'RAW', // Use 'USER_ENTERED' if you want Sheets to parse your values (such as dates)
      requestBody: {
        values: [rowData]
      }
    });
    res.json(result.data);
  } catch (error) {
    console.error('Error updating row:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
