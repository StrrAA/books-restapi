import express, { request } from "express";
import http from "http";
import mongoose from "mongoose";
import { config } from "./config/config";
import Logging from "./library/Logging";
import authorRoutes from "./routes/Author";
import bookRoutes from "./routes/Book";

const router = express();

// Connect to Mongoose
// rewrites and w majority I have taken from the server config.ts file !! Remember this Michal!
mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => {
    Logging.info("Connected to mongoDB.");
    StartServer();
  })
  .catch((error) => {
    Logging.error("Unable to connect: ");
    Logging.error(error);
  });

// Only start the server if Mongo connects

const StartServer = () => {
  router.use((req, res, next) => {
    // Log the request
    Logging.info(
      `Incomming -> Method: [${req.method}] Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
      // Log the Response
      Logging.info(
        `Outgoing -> Method: [${req.method}] Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
      );
    });

    next();
  });

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  //   RULES OF THE API
  router.use((req, res, next) => {
    // Where can the requests come from - "*" for "all"
    res.header("Access-Control-Allow-Origin", "*");
    // What headers are allowed to use in this project
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    // If you pass an OPTIONS request, it will return all the options you can use in this API
    if (req.method == "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH"
      );
      return res.status(200).json({});
    }

    // To make sure we passed our request
    next();
  });

  //   ****** ROUTES ******
  router.use("/authors", authorRoutes);
  router.use("/books", bookRoutes);

  // Health-check
  router.get("/ping", (req, res, next) =>
    res.status(200).json({ message: "working" })
  );

  //   Error Handling
  router.use((req, res, next) => {
    const error = new Error("not found");
    Logging.error(error);

    return res.status(404).json({ message: error.message });
  });

  http
    .createServer(router)
    .listen(config.server.port, () =>
      Logging.info(`Server is running on port: ${config.server.port}`)
    );
};
