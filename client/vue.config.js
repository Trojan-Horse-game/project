module.exports = {
  devServer: {
    clientLogLevel: "info"
  },
  transpileDependencies: ["vuetify"],
  publicPath:
    process.env.NODE_ENV === "production" ? "/production-sub-path/" : "/"
};
