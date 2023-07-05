const pino = require("pino");
const fs = require("fs");

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      traslateTime: true,
      ignore: "pid,hostname",
    },
  },
  level: "info",
});

module.exports = logger;
