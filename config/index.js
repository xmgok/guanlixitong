'use strict'
const path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist/'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: false ,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: process.env.PORT || 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      "/ip": {
        target: "http://192.168.31.146:8080",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/ip': '/'
        }
      },
      "/cspr": {
        target: "http://192.168.31.146:9900",
        // target: "http://192.168.31.18:9900",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/cspr': '/'
        }
      },
      "/yang": {
        target: "http://192.168.31.18:9000",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/yang': '/'
        }
      },
      "/wang": {
        target: "http://192.168.31.200:9000",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/wang': '/'
        }
      },
      "/deng": {
        target: "http://192.168.31.163:9000",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/deng': '/'
        }
      },
      //   this.$host+"": {
      //     target: "http://192.168.31.158:9000",
      //     secure: false,
      //     changeOrigin: true,
      //     pathRewrite: {
      //       '^/ip': '/'
      //     }
      //   },
      "/liu": {
        target: "http://192.168.31.158:9000",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/liu': '/'
        }
      }
    },

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },
}
