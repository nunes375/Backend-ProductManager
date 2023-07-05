const { Router } = require("express");
const controller = require("../../src/controller/productController");
const router = Router();

//GET route to fetch all products
router.get("/", controller.getProducts);

//GET route to fetch a product by title or category
router.get("/search", controller.getProductByTitleOrCategory);

//POST route to create a new product
router.post("/", controller.addProduct);

//PUT route to update a product
router.put("/:id", controller.updateProduct);

//DELETE route to delete a product
router.delete("/:id", controller.deleteProduct);

module.exports = router;