module.exports = {
  transpileDependencies: ["vuetify"],
  publicPath:
    process.env.NODE_ENV === "production" ? "/production-sub-path/" : "/",
  devServer: {
    proxy: "http://localhost:3000"
  }
};
