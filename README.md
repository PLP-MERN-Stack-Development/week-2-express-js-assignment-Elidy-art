# Express.js RESTful API

A RESTful API built with Express.js that provides endpoints for managing products. The API includes features like authentication, request validation, filtering, pagination, and search functionality.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Postman, Insomnia, or curl for API testing

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Start the server:
```bash
npm start
```

The server will start running on `http://localhost:3000` (or the port specified in your .env file).

## API Documentation

### Authentication

All API endpoints require authentication using an API key. Include the API key in the request headers:

```
x-api-key: demo-api-key
```

### Endpoints

#### 1. Get All Products
- **URL**: `/api/products`
- **Method**: `GET`
- **Query Parameters**:
  - `category` (optional): Filter by category
  - `inStock` (optional): Filter by stock status (true/false)
  - `search` (optional): Search in name and description
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)

**Example Request**:
```bash
curl "http://localhost:3000/api/products?category=electronics&inStock=true&page=1&limit=10" \
  -H "x-api-key: demo-api-key"
```

**Example Response**:
```json
{
  "total": 2,
  "page": 1,
  "limit": 10,
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    },
    {
      "id": "2",
      "name": "Smartphone",
      "description": "Latest model with 128GB storage",
      "price": 800,
      "category": "electronics",
      "inStock": true
    }
  ]
}
```

#### 2. Get Product by ID
- **URL**: `/api/products/:id`
- **Method**: `GET`

**Example Request**:
```bash
curl http://localhost:3000/api/products/1 \
  -H "x-api-key: demo-api-key"
```

**Example Response**:
```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}
```

#### 3. Create Product
- **URL**: `/api/products`
- **Method**: `POST`
- **Required Fields**:
  - `name` (string)
  - `price` (number)
  - `category` (string)
- **Optional Fields**:
  - `description` (string)
  - `inStock` (boolean)

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/products \
  -H "x-api-key: demo-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "price": 99.99,
    "category": "electronics",
    "description": "A new product",
    "inStock": true
  }'
```

**Example Response**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "New Product",
  "price": 99.99,
  "category": "electronics",
  "description": "A new product",
  "inStock": true
}
```

#### 4. Update Product
- **URL**: `/api/products/:id`
- **Method**: `PUT`
- **Required Fields** (at least one):
  - `name` (string)
  - `price` (number)
  - `category` (string)

**Example Request**:
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "x-api-key: demo-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Product",
    "price": 149.99,
    "category": "electronics"
  }'
```

**Example Response**:
```json
{
  "id": "1",
  "name": "Updated Product",
  "description": "High-performance laptop with 16GB RAM",
  "price": 149.99,
  "category": "electronics",
  "inStock": true
}
```

#### 5. Delete Product
- **URL**: `/api/products/:id`
- **Method**: `DELETE`

**Example Request**:
```bash
curl -X DELETE http://localhost:3000/api/products/1 \
  -H "x-api-key: demo-api-key"
```

**Example Response**:
```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}
```

### Error Responses

The API uses standard HTTP status codes and returns error messages in JSON format:

```json
{
  "error": "Error message here"
}
```

Common error codes:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid API key)
- `404`: Not Found
- `500`: Internal Server Error

## Project Structure

```
.
├── server.js          # Main application file
├── .env.example       # Example environment variables
├── package.json       # Project dependencies
└── README.md         # This file
```

## Environment Variables

Create a `.env` file in the root directory with the following variables (see `.env.example` for reference):

```
PORT=3000
API_KEY=demo-api-key
```

## Error Handling

The API includes comprehensive error handling:
- Input validation for all requests
- Authentication checks
- Resource existence verification
- Global error handler for unexpected errors

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 