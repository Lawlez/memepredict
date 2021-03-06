const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//const Analyzer = require('webpack-bundle-analyzer')


module.exports = {
    entry: './src/index.js',
    mode: 'development',
    target: 'web',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            title: 'Sudoku Versus',
            meta: {
                viewport:
					'width=device-width,height=device-height, initial-scale=1, maximum-scale=1, user-scalable=no',
            },
        }),
        //new Analyzer.BundleAnalyzerPlugin({analyzerMode: 'static'}),
    ],
    resolve: {
        alias: {
            '@material-ui/styles': path.resolve(
                __dirname,
                'node_modules',
                '@material-ui/styles',
            ),
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.html$/,
                use: ['html-loader'],
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8000, // Convert images < 8kb to base64 strings
                            name: 'images/[name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    devtool: 'cheap-module-eavl-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        overlay: true,
        hot: true,
        open: true,
        port: 3000,
        https: {
            key: fs.readFileSync('../SSL/key.pem'),
            cert: fs.readFileSync('../SSL/cert.pem'),
        },
        host: '0.0.0.0',
    },
}