const app = require("./app");
const port = 3000;
const logger = require("./src/logger");

app.listen(port, () => logger.info(`Server listening on port ${port}!`));
