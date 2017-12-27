const path = require("path"),
    webpack = require("webpack"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    HOST = "10.63.34.38",
    PORT = 4040;
let commonPlugins = [],
    cssExtract = process.env.NODE_ENV === "production"
        ? ExtractTextPlugin.extract({ fallback: "style", use: [ "css", "postcss", "sass" ], })
        : [ "style", "css", "postcss", "sass" ];

module.exports = {
    devServer: {
        compress: true,
        inline: true,
        hot: true,
        historyApiFallback: true,
        port: PORT,
        host: HOST,
        open: true,
        headers: {'Access-Control-Allow-Origin': '*'},
    },
    entry: [
        "babel-polyfill",
        "whatwg-fetch",
        "./src/Entry",
    ],
    output: {
        path: path.join(__dirname, "dist"),
        /*
            *publicPath:'./',
        */
        filename: "js/[name].js",
        /*
         * chunkFilename用来打包require.ensure方法中引入的模块,如果该方法中没有引入任何模块则不会生成任何chunk块文件
         * 比如在main.js文件中,require.ensure([],function(require){alert(11);}),这样不会打包块文件
         * 只有这样才会打包生成块文件require.ensure([],function(require){alert(11);require('./greeter')})
         * 或者这样require.ensure(['./greeter'],function(require){alert(11);})
         * chunk的hash值只有在require.ensure中引入的模块发生变化,hash值才会改变
         * 注意:对于不是在ensure方法中引入的模块,此属性不会生效,只能用CommonsChunkPlugin插件来提取
         * */
        chunkFilename: "js/[name].[chunkhash:6].chunk.js",
    },
    resolve: {
        extensions: [".jsx", ".js", ".sass", ".scss"],
    },
    resolveLoader: {
        moduleExtensions: ["-loader"]
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                use: ["babel"],
                exclude: /node_modules/,
            },
            {
                test: /\.(scss|sass)$/,
                use: cssExtract,
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif)$/,
                exclude: /^node_modules$/,
                loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
                //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
            },
            {
                test: /\.(mp4|ogg|svg)$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: []
};

if (process.env.NODE_ENV === "production") {
    commonPlugins = [
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: "js/vendor.bundle.js"
        }),
        new ExtractTextPlugin({
            filename: "css/[name].style.[contenthash].css",
            disable: false,
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "index.html",
            inject: true,
            hash: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            }
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            output: false,
            compress: {
                unused: true,
                dead_code: true,
                pure_getters: true,
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                comparisons: true,
                sequences: true,
                evaluate: true,
                join_vars: true,
                if_return: true,
            },
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            quiet: true,
        }),
    ];
} else {
    commonPlugins = [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "index.html",
            inject: true,
            hash: true,
        }),
        new webpack.LoaderOptionsPlugin({
            debug: true,
        }),
    ];
    module.exports.devtool = "source-map";
}

module.exports.plugins = module.exports.plugins.concat(commonPlugins);
