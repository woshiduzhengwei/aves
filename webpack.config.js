const path = require("path"),
  _ = require("lodash"),
  webpack = require("webpack"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  ExtractTextPlugin = require("extract-text-webpack-plugin");

const target = "bundles";

const styles = new ExtractTextPlugin({
  filename: path.join(target, "[name].[contenthash].css")
});

const development = {
  context: path.resolve(__dirname, "sources"),
  entry: {
    app: "./app.js",
    live: [
      "webpack/hot/dev-server",
      "webpack-dev-server/client?http://localhost:8000"
    ],
    vendor: [
      "jquery", "lodash", "moment", "element-ui",
      "vue", "vuex", "vue-router", "vue-resource",
    ]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: path.join(target, "[name].[hash].js"),
    chunkFilename: path.join(target, "[name].[chunkhash].js")
  },
  devtool: "cheap-module-eval-source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    styles,
    new HtmlWebpackPlugin({
      favicon: "assets/favicon.ico",
      template: "index.html",
      filename: "index.html"
    }),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ["vendor", "manifest"]
    })
  ],
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      "vue$": "vue/dist/vue.esm.js"
    }
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: "vue-loader",
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }, {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: "url-loader",
      options: {
        limit: 10000,
        name: "assets/images/[name].[hash].[ext]"
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: "url-loader",
      options: {
        limit: 10000,
        name: "assets/fonts/[name].[hash].[ext]"
      }
    }, {
      test: /\.less$/,
      use: styles.extract({
        use: [{
          loader: "css-loader"
        }, {
          loader: "less-loader"
        }],
        fallback: "style-loader"
      })
    }]
  }
};

const production = (development) => {
  const product = development;
  if (delete product.entry.live) {
    product.devtool = "source-map";
    product.plugins.splice(0, 2);
    product.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        sourceMap: true
      })
    );
    return product;
  }
};

module.exports = {
  development,
  production
};
