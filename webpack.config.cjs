const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

module.exports = (env) => {
  const isProduction = env.NODE_ENV === "production";
  const dotenvFilename = isProduction ? ".env.production" : ".env.development";

  return {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].bundle.js",
      clean: true,
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    watchOptions: {
      ignored: /node_modules/,
    },
    devtool: "inline-source-map",
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      compress: true,
      port: 3000,
      open: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    resolve: {
      fallback: {
        vm: false,
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        process: require.resolve("process/browser"),
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        favicon: "./public/favicon.ico",
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
      }),
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
      new webpack.NormalModuleReplacementPlugin(/node:crypto/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      }),
      new NodePolyfillPlugin(),
      new Dotenv({
        path: dotenvFilename,
      }),
    ],
  };
};
