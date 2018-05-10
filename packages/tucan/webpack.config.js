const path = require("path");
const merge = require("webpack-merge");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const common = {
  mode: "development",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    path: path.resolve(__dirname, "lib")
  }
};

const clientConfig = merge(common, {
  output: {
    filename: "index.js"
  },
  plugins: [new BundleAnalyzerPlugin()]
});

module.exports = [clientConfig];
