const sheetModel = require('../models/sheetModel'); // Import model

exports.getAll = async (req, res) => {
  try {
    const data = await sheetModel.getAll();
    res.json(data);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const rowData = req.body;
    const result = await sheetModel.create(rowData);
    res.status(201).json(result); // Return 201 Created
  } catch (error) {
    console.error('Error creating row:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const rowData = req.body;
    const result = await sheetModel.update(id, rowData);
    res.json(result);
  } catch (error) {
    console.error('Error updating row:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await sheetModel.delete(id);
    res.status(204).send(); // Return 204 No Content
  } catch (error) {
    console.error('Error deleting row:', error);
    res.status(500).json({ error: error.message });
  }
};
