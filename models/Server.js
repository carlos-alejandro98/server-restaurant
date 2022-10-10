const express = require("express");
const connectDB = require("../database");
const cors = require("cors");
const morgan = require("morgan");
const { readdirSync } = require("fs");
const swaggerUI = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerConfig = require("../documentation/swagger.config.json");
const swaggerDocs = swaggerJsdoc(swaggerConfig);

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.middlewares();
    this.routes();
    connectDB();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(express.json({ limit: "2mb" }));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.static("public"));
    this.app.use(
      "/api/docs",
      swaggerUI.serve,
      swaggerUI.setup(swaggerDocs, { explorer: true })
    );
  }

  routes() {
    readdirSync("./routes").map((r) =>
      this.app.use("/api", require("../routes/" + r))
    );
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server is running in   http://localhost:" + this.port);
    });
  }
}

module.exports = Server;
