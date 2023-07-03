const express = require('express');
const productRoutes = require('./src/productManager/routes');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/api/v1/products', productRoutes);

app.listen(port, () => console.log(`Server listening on port ${port}!`));