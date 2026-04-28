import express from "express";
import "./jobs/product-cron.jobs";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import { errorMiddleware } from "../../../packages/error-handler/error-middleware";
import router from "./routes/product.route";
import { ensureImageIndexes } from "./utils/ensure-image-indexes";

const swaggerDocument = require("./swagger-output.json");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({ message: "Hello Product API" });
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.get("/docs-json", (req, res) => {
  res.json(swaggerDocument);
});

// Routes
app.use("/api", router);

const startServer = async () => {
  await ensureImageIndexes();

  const port = process.env.PORT || 6002;
  const server = app.listen(port, () => {
    console.log(`Product service listening at http://localhost:${port}/api`);
    console.log(
      `API documentation available at http://localhost:${port}/api-docs`,
    );
  });

  app.use(errorMiddleware);
  server.on("error", console.error);
};

startServer().catch((error) => {
  console.error("Failed to start product service", error);
  process.exit(1);
});
