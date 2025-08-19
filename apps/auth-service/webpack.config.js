const { NxAppWebpackPlugin } = require("@nx/webpack/app-plugin");
const e = require("express");
const { join, resolve } = require("path");

module.exports = {
  output: {
    path: join(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: "node",
      compiler: "tsc",
      main: "./src/main.ts",
      tsConfig: "./tsconfig.app.json",
      optimization: false,
      outputHashing: "none",
      generatePackageJson: true,
    }),
  ],
};
