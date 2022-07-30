const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    context: `${__dirname}/src`,
    entry: `./main.js`,
    output: {
      path: `${__dirname}/public`,
      filename: "main.min.js"
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    "css-loader",
                ],
            },
            {
                test: /\.html$/,
                use: [
                    "html-loader",
                ],
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                type: 'asset/source'
            }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "style.css",
        }),
        new HtmlWebpackPlugin({
            template: "index.html"
        }),
    ],
    devServer: {
        static: "dist",
        open: true
    }
  };