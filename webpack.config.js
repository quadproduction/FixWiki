/*******************************************************
 * Copyright (C) 2019-2021 Kévin Zarshenas
 * kevin.zarshenas@gmail.com
 * 
 * This file is part of LuckyPHP.
 * 
 * This code can not be copied and/or distributed without the express
 * permission of Kévin Zarshenas @kekefreedog
 *******************************************************/
/** Dependances
 * 
 */
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const RemovePlugin = require('remove-files-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');
/** Prepare module
 * 
 */
module.exports = {
    /* Main js file */
    entry: {
        "bundle": './resources/js/bundle.js',
        "app": './resources/js/app.js',
        "css": './resources/js/css.js',
    },
    /* Output for www */
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'www/js'),
    },
    resolve: {
        alias: {
           handlebars: 'handlebars/dist/handlebars.min.js'
        }
    },
    module: {
        rules: [
            /* Scss | Css */
            {
                test: /\.(sa|sc|c|le)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                outputStyle: "compressed",
                            },
                        },
                    },
                ],
            },
            /* Fonts */
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                type: 'asset/resource',
                generator: {
                    filename: './../fonts/[name][ext]',
                },
            },
            /* Svg */
            {
                test: /\.svg$/,
                generator: {
                    filename: './../svg/[name]-[id][ext]',
                },
            },
            /* Txt */
            {
                test: /\.txt$/,
                generator: {
                    filename: './../etc/[name][ext]',
                },
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            parallel: true,
            terserOptions: {
                format: {
                    comments: false,
                },
            },
            extractComments: {
                condition: true,
                filename: (fileData) => {
                    return `licences.txt${fileData.query}`;
                },
            },
        })],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "../css/[name].[contenthash].css",
            chunkFilename: "../css/[id].[contenthash].css",
        }),
        /* Clean js with hash */
        new RemovePlugin({
            before: {
                include: [
                    './www/js',
                    './www/css',
                    './www/svg',
                    './www/fonts',
                ],
            },
            watch: {
                include: [
                    './www/js',
                    './www/css',
                    './www/svg',
                    './www/fonts',
                ],
            },
            after: {
                include: [
                    './www/js/css.js'
                ]
            }
        })
    ]
};