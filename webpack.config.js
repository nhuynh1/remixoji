const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    entry: './app/script.js',
    output: {
        filename: 'script.js',
        path: path.resolve(__dirname, 'public'),
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ["@babel/plugin-proposal-class-properties"],
                    },
                },
            },
            {
                test: /\.css$/,
                include: /app/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ],
            },
            {
                test: /\.svg$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                }
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin({
                sourceMap: true,
            }),
            new TerserPlugin(),
        ],
    },
    devtool: 'source-map',
};