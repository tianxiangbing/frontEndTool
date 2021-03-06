const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
let extractCSS = new ExtractTextPlugin({ filename: 'app.css', allChunks: true });
// __webpack_public_path__ = '/dist/';
let isDev = process.env.NODE_ENV == "development";
console.log(isDev)

//动态创建html
var HtmlWebpackPlugin = require('html-webpack-plugin');
var htmlPlugin = new HtmlWebpackPlugin({
    title: "首页",
    filename: 'index.html',
    template: "template.html"
});
const config = {
    entry: './app/main.js',
    mode: isDev ? 'development' : 'production',
    context: __dirname,
    output: {
        filename: 'app.js',
        path: __dirname + '/dist',        //真实存放路径
        publicPath: isDev ?
            '/' :                        //开发引用路径
            ''  //发布引用路径
    },
    module: {
        noParse: function (content) {
            return /renderer/.test(content);
        },
        rules: [
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS,
                    , options: {
                        includePaths: ["app/assets", "app/views", "app/utils"]
                    }
                }]
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }
            },
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            css: ExtractTextPlugin.extract({
                                use: 'css-loader',
                                fallback: 'vue-style-loader' // <- 这是vue-loader的依赖，所以如果使用npm3，则不需要显式安装
                            })
                        }
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 100,
                    name: '[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.css$/,
                use: extractCSS.extract({
                    use: ['css-loader']
                })
            }
        ]
    },
    resolve: {
        // 解析模块请求的选项
        // （不适用于对 loader 解析）
        modules: [
            "node_modules",
            path.resolve(__dirname, "app"),
            path.resolve(__dirname, "app/views")
        ],
        // 用于查找模块的目录
        extensions: [".js", ".json", ".vue", ".jsx", ".css", ".scss"],
        // 使用的扩展名
        alias: {
            // 模块别名列表

            //   "module": "new-module",
            //   // 起别名："module" -> "new-module" 和 "module/path/file" -> "new-module/path/file"

            //   "only-module$": "new-module",
            //   // 起别名 "only-module" -> "new-module"，但不匹配 "only-module/path/file" -> "new-module/path/file"

            //   "module": path.resolve(__dirname, "app/third/module.js"),
            // 起别名 "module" -> "./app/third/module.js" 和 "module/file" 会导致错误
            // 模块别名相对于当前上下文导入
            "utils": path.resolve(__dirname, "app/utils"),
            "baseCss": path.resolve(__dirname, "app/assets/base.scss"),
            "store": path.resolve(__dirname, "app/store"),
            "components": path.resolve(__dirname, "app/components"),
            "renderer": path.resolve(__dirname, "app/utils/renderer.js"),
            // 'vue': 'vue/dist/vue.js'
        }
    },
    performance: {

        hints: "warning", // 枚举

        maxAssetSize: 300000, // 整数类型（以字节为单位）

        maxEntrypointSize: 500000, // 整数类型（以字节为单位）

        assetFilter: function (assetFilename) {

            // 提供资源文件名的断言函数

            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');

        }

    },
    plugins: [
        extractCSS,
        htmlPlugin
    ]
};

module.exports = config