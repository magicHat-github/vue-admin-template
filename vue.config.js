'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}
// 页面标题
const name = defaultSettings.title || 'vue Admin Template'

/**
 * 项目运行 npm run dev,
 * 默认加载文件.env.development,
 * process.env.NODE_ENV=development (这个是根据文件名加载)
 */

// 如果您的端口设置为80，
// 使用管理员权限执行命令行。
// 例如，Mac：sudo npm run
// 您可以通过以下方法更改端口：
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528

// 所有配置项说明都可以在https://cli.vuejs.org/config/ 中找到
module.exports = {
  /**
   * 如果您计划在子路径下部署站点，则需要设置publicPath，
   * 例如 GitHub Pages。 如果您计划将您的网站部署到 https://foo.github.io/bar/，
   * 然后将publicPath设置为 "/bar/".
   * 在大多数情况下，请使用 '/' !!!
   * 详情: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  // 打包输出目录
  outputDir: 'dist',
  // 静态文件目录
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    // 自动启动浏览器
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      /**
       * 如果目标路径为 http://127.0.0.1:9528/mock/user/login
       * 设置 target: 'http://127.0.0.1:${port}/mock'
       * 内部 URL的请求地址可以为: baseURL + /user/login
       * 代理路由为 baseURL + /user/login  =>  mock/user/login
       * baseURL由 pathRewrite路径重写进行覆盖
       * 详情: https://cli.vuejs.org/config/#devserver-proxy
       */
      [process.env.VUE_APP_BASE_API]: {
        target: `http://127.0.0.1:${port}`,
        // 设置IP和端口的代理
        // target: `http://127.0.0.1:8090`,

        // 跨域
        changeOrigin: true,
        // 路径重写
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    after: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // 在 webpack的名称字段中提供应用程序的标题，
    // 以便可以在 index.html中访问它以注入正确的标题。
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    // 设置 svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // 设置 preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
