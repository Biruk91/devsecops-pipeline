const express = require('express');

const app = express();
app.use(express.json());

// In-memory data store for demonstration
const items = [
  { id: 1, name: 'Secure API Gateway', category: 'Infrastructure' },
  { id: 2, name: 'Automated SAST Scanner', category: 'DevSecOps' }
];

// Endpoint 1: Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Endpoint 2: Retrieve all items
app.get('/api/items', (req, res) => {
  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  });
});

// Endpoint 3: Create a new item (with input validation)
app.post('/api/items', (req, res) => {
  const { name, category } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Item name is required and must be a non-empty string.'
    });
  }

  const newItem = {
    id: items.length + 1,
    name: name.trim(),
    category: category ? String(category).trim() : 'General'
  };

  items.push(newItem);
  return res.status(201).json({
    success: true,
    data: newItem
  });
});

module.exports = app;

