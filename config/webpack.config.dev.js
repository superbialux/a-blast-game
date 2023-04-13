const config = require("./webpack.config")

module.exports = {
  ...config,
  mode: "development",
  devServer: {
    port: 8080,
    open: true,
  },
}