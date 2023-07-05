const e = require("express");
const pool = require("../../db");
const queries = require("../queries/productQueries");

//get all products
const getProducts = (req, res) => {
  // Retrieve all products from the database
  pool.query(queries.getProducts, (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

//get product by id
const getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  // Retrieve a product from the database based on the provided id
  pool.query(queries.getProductById, [id], (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
};

//add product
const addProduct = (req, res) => {
  const { title, description, price, category } = req.body;

  // Check if product exists
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
      const formattedCategory =
        category.length > 0 ? `{${category.join(",")}}` : null;

      // Add product
      pool.query(
        queries.addProduct,
        [title, description, price, formattedCategory],
        (error, results) => {
          if (error) throw error;
          res.status(201).send("Product added successfully.");
        }
      );
    }
  });
};

//get product by title or category
const getProductByTitleOrCategory = (req, res) => {
  const { titulo, categoria } = req.query;

  if (categoria && titulo) {
    // Retrieve products from the database based on both title and category
    pool.query(
      queries.getProductByTitleOrCategory,
      [titulo, categoria],
      (error, results) => {
        console.log(queries.getProductByTitleOrCategory);
        if (error) {
          res.status(500).send(error);
        } else if (results.rows.length === 0) {
          res.status(400).send("Product does not exist.");
        } else {
          res.status(200).json(results.rows);
        }
      }
    );
  } else if (titulo) {
    pool.query(queries.getProductByTitle, [titulo], (error, results) => {
      console.log(queries.getProductByTitle);
      if (error) {
        res.status(500).send(error);
      } else if (results.rows.length === 0) {
        res.status(400).send("Product does not exist.");
      } else {
        res.status(200).json(results.rows);
      }
    });
  } else if (categoria) {
    pool.query(queries.getProductByCategory, [categoria], (error, results) => {
      console.log(queries.getProductByCategory);
      if (error) {
        res.status(500).send(error);
      } else if (results.rows.length === 0) {
        res.status(400).send("Category does not exist.");
      } else {
      res.status(200).json(results.rows);
      }
    });

  } else {
    pool.query(queries.getProducts, (error, results) => {
      console.log(queries.getProducts);
      if (error) {
        res.status(500).send(error);
      } else if (results.rows.length === 0) {
        res.status(400).send("Product does not exist.");
      } else {
        res.status(200).json(results.rows);
      }
    });
  }
};

//delete product
const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);

  // Check if the product exists in the database
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

//update product
const updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, price, category } = req.body;

  // Check if the product exists in the database
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
      category: category || existingProduct.category,
    };

    pool.query(
      queries.updateProduct,
      [
        updatedProduct.title,
        updatedProduct.description,
        updatedProduct.price,
        updatedProduct.category,
        id,
      ],
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
  getProductByTitleOrCategory,
  deleteProduct,
  updateProduct,
};