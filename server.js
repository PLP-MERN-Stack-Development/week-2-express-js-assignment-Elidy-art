const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Custom middleware for request logging
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

// Custom middleware for authentication (simplified for demo)
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== 'demo-api-key') {
    return res.status(401).json({ error: 'Unauthorized - Invalid API key' });
  }
  next();
};

// Custom middleware for request validation
const validateProduct = (req, res, next) => {
  const { name, price, category } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string') {
    errors.push('Name is required and must be a string');
  }
  if (!price || typeof price !== 'number' || price < 0) {
    errors.push('Price is required and must be a positive number');
  }
  if (!category || typeof category !== 'string') {
    errors.push('Category is required and must be a string');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

// Apply middleware
app.use(requestLogger);
app.use('/api', authenticate);

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// GET /api/products - Get all products with filtering, pagination, and search
app.get('/api/products', (req, res) => {
  try {
    let filteredProducts = [...products];
    const { category, inStock, search, page = 1, limit = 10 } = req.query;

    // Apply filters
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    if (inStock !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.inStock === (inStock === 'true'));
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      total: filteredProducts.length,
      page: parseInt(page),
      limit: parseInt(limit),
      products: paginatedProducts
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/products - Create a new product
app.post('/api/products', validateProduct, (req, res) => {
  try {
    const newProduct = {
      id: uuidv4(),
      ...req.body,
      inStock: req.body.inStock ?? true
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', validateProduct, (req, res) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = {
      ...products[index],
      ...req.body,
      id: req.params.id
    };
    products[index] = updatedProduct;
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const deletedProduct = products[index];
    products = products.filter(p => p.id !== req.params.id);
    res.json(deletedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; 