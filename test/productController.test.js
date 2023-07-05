const request = require("supertest");
const Pool = require("pg");
const app = require("../app");
require("dotenv").config();

let pool; // Declare pool variable

//add product to database before testing
beforeAll(async () => {
  pool = new Pool.Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  await pool.query(
    `INSERT INTO products (title, description, price, category) VALUES ('Test Product', 'Test Product Description', 10.99, '{Test Category}')`
  );
});

//remove product from database after testing
afterAll(async () => {
  await pool.query(`DELETE FROM products WHERE title = 'Test Product'`);
  await pool.end(); // Close the PostgreSQL connection pool
});

//test get all products
describe("GET /api/v1/products", () => {
  test("should respond with status code 200", async () => {
    const response = await request(app).get("/api/v1/products");
    expect(response.statusCode).toBe(200);
  });
});

//test get product by title or category
describe("GET /api/v1/products/search", () => {
  test("should respond with status code 200", async () => {
    const response = await request(app).get(
      "/api/v1/products/search?titulo=Test Product&categoria=Test Category"
    );
    expect(response.statusCode).toBe(200);
  });
});

//test add product
describe("POST /api/v1/products", () => {
  test("should add a product and respond with status code 201", async () => {
    const response = await request(app)
      .post("/api/v1/products/")
      .send({
        title: "Test Add Product",
        description: "Test Add Product Description",
        price: 10.99,
        category: ["Test Add Category"],
      });
    expect(response.status).toBe(201);
    expect(response.text).toBe("Product added successfully.");
    await pool.query(`DELETE FROM products WHERE title = 'Test Add Product'`);
  });
});

// //test update product
describe("PUT /api/v1/products/:id", () => {
  test("should update a product and respond with status code 200", async () => {
    // Create a new product to update
    await request(app)
      .post("/api/v1/products")
      .send({
        title: "Test Update Product",
        description: "Test Update Product Description",
        price: 10.99,
        category: ["Test Update Category"],
      });

    // Retrieve the id of the created product
    const result = await pool.query(
      `SELECT id FROM products WHERE title = 'Test Update Product'`
    );
    const id = result.rows[0].id;

    // Update the product
    const updatedProductResponse = await request(app)
      .put(`/api/v1/products/${id}`)
      .send({
        title: "Updated Product",
        description: "Updated Product Description",
        price: 19.99,
        category: ["Updated Category"],
      });

    // Assertions
    expect(updatedProductResponse.status).toBe(200);
    expect(updatedProductResponse.text).toBe("Product updated successfully.");

    // Clean up: Delete the product from the database
    await request(app).delete(`/api/v1/products/${id}`);
  });
});

//test delete product
describe("DELETE /api/v1/products/:id", () => {
  test("should delete a product and respond with status code 200", async () => {
    const addProductResponse = await request(app)
      .post("/api/v1/products")
      .send({
        title: "Test Delete Product",
        description: "Test Delete Product Description",
        price: 10.99,
        category: ["Test Delete Category"],
      });

    expect(addProductResponse.status).toBe(201);

    const result = await pool.query(
      `SELECT id FROM products WHERE title = 'Test Delete Product'`
    );
    const id = result.rows[0].id;

    const deletedProductResponse = await request(app).delete(
      `/api/v1/products/${id}`
    );

    expect(deletedProductResponse.status).toBe(200);
    expect(deletedProductResponse.text).toBe("Product deleted successfully.");
  });
});
