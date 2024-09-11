import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'

console.log(`Running webpack in ${isDev ? 'development' : 'production'} mode`)

const pack = {
  entry: {
    core: './app/frontend/css/index.js',
    cookies: './app/frontend/js/cookies.js'
  },
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.(?:s[ac]|c)ss$/i,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
              esModule: false
            }
          },
          'css-loader',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
              sassOptions: {
                outputStyle: 'compressed'
              }
            }
          }
        ],
        resolve: {
          modules: [resolve(__dirname, 'node_modules'), 'node_modules']
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'images/'
          }
        },
        resolve: {
          modules: [resolve(__dirname, 'node_modules'), 'node_modules']
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'fonts/'
          }
        },
        resolve: {
          modules: [resolve(__dirname, 'node_modules'), 'node_modules']
        }
      }
    ]
  },
  output: {
    filename: 'js/[name].[fullhash].js',
    path: resolve(__dirname, 'app/dist'),
    library: '[name]'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      filename: '../views/_layout.njk',
      template: 'app/views/_layout.template.njk',
      chunks: ['core']
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: '../views/cookies/_cookie-banner.njk',
      template: 'app/views/cookies/_cookie-banner.template.njk',
      chunks: ['cookies']
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[fullhash].css'
    })
  ]
}

export default pack
