import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/auth.route";
import swaggerUI from "swagger-ui-express";
import { errorMiddleware } from "../../../packages/error-handler/error-middleware";

const swaggerDocument = require("./swagger-output.json");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({ message: "Hello API" });
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.get("/docs-json", (req, res) => {
  res.json(swaggerDocument);
});

// Routes
app.use("/api", router);

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`Auth service listening at http://localhost:${port}/api`);
  console.log(
    `API documentation available at http://localhost:${port}/api-docs`
  );
});

app.use(errorMiddleware);
server.on("error", console.error);
