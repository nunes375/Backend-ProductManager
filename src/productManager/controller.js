const pool = require('../../db');
const queries = require('./queries');

const getProducts = (req, res) => {
  pool.query(queries.getProducts, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.getProductById, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

const addProduct = (req, res) => {
    const { title, description, price, category } = req.body;
  
    // check if product exists
    pool.query(queries.getProductByTitle, [title], (error, results) => {
      if (error) throw error;
      if (results.rows.length > 0) {
        res.status(400).send("Product already exists.");
      } else {
        // Check if category is an array
        if (!Array.isArray(category)) {
          res.status(400).send("Category must be an array.");
          return;
        }
  
        // Format the category array correctly
        const formattedCategory = `{${category.join(',')}}`;
  
        // add product
        pool.query(queries.addProduct, [title, description, price, formattedCategory], (error, results) => {
          if (error) throw error;
          res.status(201).send("Product added successfully.");
        });
      }
    });
};  

const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(queries.getProductById, [id], (error, results) => {
    if (error) throw error;
    if (results.rows.length === 0) {
      res.status(400).send("Product does not exist.");
    } else {
      pool.query(queries.removeProduct, [id], (error, results) => {
        if (error) throw error;
        res.status(200).send("Product deleted successfully.");
      });
    }
  });
};

const updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, price, category } = req.body;

  pool.query(queries.getProductById, [id], (error, results) => {
    if (error) throw error;
    if (results.rows.length === 0) {
      res.status(400).send("Product does not exist.");
      return;
    }

    // Get the existing product details
    const existingProduct = results.rows[0];

    // Update only the provided fields
    const updatedProduct = {
      title: title || existingProduct.title,
      description: description || existingProduct.description,
      price: price || existingProduct.price,
      category: category || existingProduct.category
    };

    pool.query(
      queries.updateProduct,
      [updatedProduct.title, updatedProduct.description, updatedProduct.price, updatedProduct.category, id],
      (error, results) => {
        if (error) throw error;
        res.status(200).send("Product updated successfully.");
      }
    );
  });
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
};