const path = require('path');

module.exports = {
    entry: './app/script.js',
    output: {
        filename: 'script.js',
        path: path.resolve(__dirname, 'public'),
    },
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
                    }
                }
            }
        ]
    },
    devtool: 'eval-source-map',
};