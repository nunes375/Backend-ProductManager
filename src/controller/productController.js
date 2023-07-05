const e = require("express");
const pool = require("../../db");
const queries = require("../queries/productQueries");
const logger = require("../logger");

// Error handling middleware
const handleErrors = (res, error) => {
  logger.error(error);
  res.status(500).send("Internal Server Error");
};

//get all products
const getProducts = (req, res) => {
  // Retrieve all products from the database
  pool.query(queries.getProducts, (error, results) => {
    if (error) {
      handleErrors(res, error);
      return;
    }
    logger.info('Products retrieved successfully.');
    res.status(200).json(results.rows);
  });
};

//get product by id
const getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  // Retrieve a product from the database based on the provided id
  pool.query(queries.getProductById, [id], (error, results) => {
    if (error) {
      handleErrors(res, error);
      return;
    }
    if (results.rows.length === 0) {
      res.status(404).send("Product not found.");
      logger.warn("Product not found.");
    } else {
      res.status(200).json(results.rows);
      logger.info("Product retrieved successfully.");
    }
  });
};

//add product
const addProduct = (req, res) => {
  const { title, description, price, category } = req.body;

  // Check if product exists
  pool.query(queries.getProductByTitle, [title], (error, results) => {
    if (error) {
      handleErrors(res, error);
      return;
    }
    if (results.rows.length > 0) {
      res.status(400).send("Product already exists.");
      logger.warn("Product already exists.");
    } else {
      // Check if category is an array
      if (!Array.isArray(category)) {
        res.status(400).send("Category must be an array.");
        logger.warn("Category must be an array.");
        return;
      }

      // Format the category array correctly
      const formattedCategory =
        category.length > 0 ? `{${category.join(",")}}` : null;
        logger.trace(formattedCategory);

      // Add product
      pool.query(
        queries.addProduct,
        [title, description, price, formattedCategory],
        (error, results) => {
          if (error) {
            handleErrors(res, error);
            return;
          }
          res.status(201).send("Product added successfully.");
          logger.info("Product added successfully.");
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
        if (error) {
          handleErrors(res, error);
          return;
        }
        if (results.rows.length === 0) {
          res.status(404).send("Product not found.");
          logger.warn("Product not found.");
        } else {
          res.status(200).json(results.rows);
          logger.info("Product retrieved successfully.");
        }
      }
    );
  } else if (titulo) {
    pool.query(queries.getProductByTitle, [titulo], (error, results) => {
      if (error) {
        handleErrors(res, error);
        return;
      }
      if (results.rows.length === 0) {
        res.status(404).send("Product not found.");
        logger.warn("Product not found.");
      } else {
        res.status(200).json(results.rows);
        logger.info("Product retrieved successfully.");
      }
    });
  } else if (categoria) {
    pool.query(queries.getProductByCategory, [categoria], (error, results) => {
      if (error) {
        handleErrors(res, error);
        return;
      }
      if (results.rows.length === 0) {
        res.status(404).send("Category not found.");
        logger.warn("Category not found.");
      } else {
        res.status(200).json(results.rows);
        logger.info("Category retrieved successfully.");
      }
    });
  } else {
    pool.query(queries.getProducts, (error, results) => {
      if (error) {
        handleErrors(res, error);
        return;
      }
      if (results.rows.length === 0) {
        res.status(404).send("Product not found.");
        logger.warn("Product not found.");
      } else {
        res.status(200).json(results.rows);
        logger.info("Product retrieved successfully.");
      }
    });
  }
};

//delete product
const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);

  // Check if the product exists in the database
  pool.query(queries.getProductById, [id], (error, results) => {
    if (error) {
      handleErrors(res, error);
      return;
    }
    if (results.rows.length === 0) {
      res.status(404).send("Product not found.");
      logger.warn("Product not found.");
    } else {
      pool.query(queries.removeProduct, [id], (error, results) => {
        if (error) {
          handleErrors(res, error);
          return;
        }
        res.status(200).send("Product deleted successfully.");
        logger.info("Product deleted successfully.");
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
    if (error) {
      handleErrors(res, error);
      return;
    }
    if (results.rows.length === 0) {
      res.status(404).send("Product not found.");
      logger.warn("Product not found.");
      return;
    }

    // Get the existing product details
    const existingProduct = results.rows[0];
    logger.trace(existingProduct);

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
        if (error) {
          handleErrors(res, error);
          return;
        }
        res.status(200).send("Product updated successfully.");
        logger.info("Product updated successfully.");
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