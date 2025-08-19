import { version } from "os";
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Auth Service API",
    description:
      "Automatically generated Swagger documentation for the Auth Service",
    version: "1.0.0",
  },
  host: "localhost:6001",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endPointsFiles = ["./routes/auth.route.ts"];

swaggerAutogen()(outputFile, endPointsFiles, doc);
