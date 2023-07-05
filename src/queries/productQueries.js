const getProducts = "SELECT * FROM products";
const getProductById = "SELECT * FROM products WHERE id = $1";
const getProductByTitle = "SELECT * FROM products WHERE title = $1";
const getProductByTitleOrCategory = "SELECT * FROM products WHERE title = $1 AND $2 = ANY (category)";
const getProductByCategory = "SELECT * FROM products WHERE $1 = ANY (category)";
const addProduct = "INSERT INTO products (title, description, price, category) VALUES ($1, $2, $3, $4)";
const removeProduct = "DELETE FROM products WHERE id = $1";
const updateProduct = "UPDATE products SET title = $1, description = $2, price = $3, category = $4 WHERE id = $5";

module.exports = {
  getProducts,
  getProductById,
  getProductByTitle,
  getProductByCategory,
  getProductByTitleOrCategory,
  addProduct,
  removeProduct,
  updateProduct,
};
