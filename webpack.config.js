const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const webpack = require("webpack")
const devMode = process.env.NODE_ENV !== "production"
const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = {
  entry: "./src/index.js",
  mode: "development",

  output: {
    // Тут мы указываем полный путь к директории, где будет храниться конечный файл
    path: path.resolve(__dirname, "dist"),

    // Указываем имя этого файла
    filename: "[name].bundle.js",
  },

  devtool: 'eval-cheap-module-source-map',

  plugins: [
    // Указываем что будем обрабатывать HTML с помощью плагина
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    new MiniCssExtractPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: "/node_modules/",
      },

      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },

      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },

      {
        test: /\.scss$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { sourceMap: true },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [
                  // Add your PostCSS plugins here
                  require("autoprefixer"),
                ],
              },
            },
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true },
          },
        ],
        exclude: "/node_modules/",
      },
      {
        test: /\.css$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { sourceMap: true },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [
                  // Add your PostCSS plugins here
                  require("autoprefixer"),
                ],
              },
            },
          },
        ],
      },
    ],
  },

  devServer: {
    // Здесь указывается вся статика, которая будет на нашем сервере
    static: {
      directory: path.join(__dirname, "dist"),
    },
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3003',
        changeOrigin: true
      },
    ],

    // Сжимать ли бандл при компиляции
    compress: true,

    // Порт на котором будет наш сервер
    port: 3000,
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: true,
      },
    },
  },

  // watch: true,
  // watchOptions: {
  //   // Директории, которые watch будет игнорировать
  //   ignored: /node_modules/,
  // },

  // optimization: {
  //   splitChunks: {
  //     chunks: 'async',
  //     minSize: 20000,
  //     minRemainingSize: 0,
  //     minChunks: 1,
  //     maxAsyncRequests: 30,
  //     maxInitialRequests: 30,
  //     enforceSizeThreshold: 50000,
  //     cacheGroups: {
  //       defaultVendors: {
  //         test: /[\\/]node_modules[\\/]/,
  //         priority: -10,
  //         reuseExistingChunk: true,
  //       },
  //       default: {
  //         minChunks: 2,
  //         priority: -20,
  //         reuseExistingChunk: true,
  //       },
  //     },
  //   },
  // },
}
