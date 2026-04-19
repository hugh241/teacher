const { defineConfig } = require("@vue/cli-service");
const path = require("path");
const defaultSettings = require("./src/settings.js");

function resolve(dir) {
  return path.join(__dirname, dir);
}
const name = defaultSettings.title || process.env.VUE_APP_ALL_TITLE; // 标题

const port = process.env.port || process.env.npm_config_port || 8008; // 端口
module.exports = defineConfig({
  transpileDependencies: true, // 是否对依赖进行转译
  publicPath: process.env.VUE_APP_IS_PROD === "1" ? "/hd/teacherTraining" : "/",
  // publicPath: 'https://cdnbasic.scbdc.edu.cn/%E7%9C%81%E7%BA%A7%E8%B5%84%E6%BA%90/hd/',
  outputDir: "teacherTraining", // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  assetsDir: "static", // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  lintOnSave: false, // 关闭eslint检测
  devServer: {
    host: "0.0.0.0",
    port: port,
    client: {
      //取消错误警告全屏覆盖
      overlay: false,
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        // target: `http://127.0.0.1:9000/prod-teacher-training-api/`,
        // target: `http://10.43.236.27:9090`,
        // target: `http://10.43.201.40:9090`,
        // target: `https://113.219.237.106:65519`, // 家里连接的环境
        // target: `http://172.19.32.55:9090`, // 浦新教育厅
        // target: `http://172.19.32.42:9090`, // 杨鹏飞教育厅 
        // target: `http://10.43.207.169:9090`, // 杨鹏飞教育厅 
        target: `http://192.168.0.200:9091`, // 杨鹏飞教育厅 
        // target: `https://basic.sc.smartedu.cn/hd/teacherTraining/api/`,
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: "",
        },
      },
    },
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
    output: {
      filename: '[name].[hash:14].js',
      chunkFilename: '[name].[hash:14].js'
    },
  },
  css: {
    extract: {
      filename: '[name].[hash:14].css',
      chunkFilename: '[name].[hash:14].css'
    }
  },
  chainWebpack(config) {
    config.plugins.delete("prefetch");

    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    config.when(process.env.NODE_ENV !== "development", (config) => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            inline: /runtime\..*\.js$/,
          },
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial",
          },
          elementUI: {
            name: "chunk-elementUI",
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk("single");
    });
  },
});
