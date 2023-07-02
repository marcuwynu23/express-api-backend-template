const path = require("path");
module.exports = {
  mode: "production",
  entry: "./bin/www",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
  },
  target: "node",
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
    ],
  },
};
