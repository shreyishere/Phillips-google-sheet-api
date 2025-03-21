const express = require('express');
const router = express.Router();
const sheetController = require('../controllers/sheetController'); // Update path to controller

// Define RESTful routes
router.get('/', sheetController.getAll); // GET /sheet - Retrieve all rows
router.post('/', sheetController.create); // POST /sheet - Create a new row
router.put('/:id', sheetController.update); // PUT /sheet/:id - Update a specific row
router.delete('/:id', sheetController.delete); // DELETE /sheet/:id - Delete a specific row

module.exports = router;
