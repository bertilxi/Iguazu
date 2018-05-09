/* tslint:disable: no-console */

import * as webpack from "webpack";
import * as nodeExternals from "webpack-node-externals";
import * as FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin";
import { paths } from "./paths";

// This is the Webpack configuration.
// It is focused on developer experience and fast rebuilds.
export const defaultConfig = options => {
  return {
    target: "node",
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    devtool: "source-map",
    externals: nodeExternals({
      modulesFromFile: true,
      whitelist: [
        /\.(eot|woff|woff2|ttf|otf)$/,
        /\.(svg|png|jpg|jpeg|gif|ico|webm)$/,
        /\.(mp4|mp3|ogg|swf|webp)$/,
        /\.(css|scss|sass|less|styl)$/
      ]
    }),
    performance: {
      hints: false
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".json"]
    },
    node: {
      __filename: true,
      __dirname: true
    },
    entry: {
      main: [`${paths.serverSrcPath}/index`]
    },
    output: {
      path: paths.serverBuildPath,
      filename: "[name].js",
      sourceMapFilename: "[name].map",
      publicPath: paths.publicPath,
      libraryTarget: "commonjs2"
    },
    // Define a few default Webpack loaders. Notice the use of the new
    // Webpack 2 configuration: module.rules instead of module.loaders
    module: {
      rules: [
        // This is the development configuration.
        // It is focused on developer experience and fast rebuilds.
        {
          test: /\.json$/,
          loader: require.resolve("json-loader")
        },
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      // We define some sensible Webpack flags. One for the Node environment,
      // and one for dev / production. These become global variables. Note if
      // you use something like eslint or standard in your editor, you will
      // want to configure __DEV__ as a global variable accordingly.
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(options.env),
        __DEV__: options.env === "development"
      }),
      // In order to provide sourcemaps, we automagically insert this at the
      // top of each file using the BannerPlugin.
      new webpack.BannerPlugin({
        raw: true,
        entryOnly: false,
        banner: `require('${
          // Is source-map-support installed as project dependency, or linked?
          require.resolve("source-map-support").indexOf(process.cwd()) === 0
            ? // If it's resolvable from the project root, it's a project dependency.
              "source-map-support/register"
            : // It's not under the project, it's linked via lerna.
              require.resolve("source-map-support/register")
        }')`
      }),
      // The FriendlyErrorsWebpackPlugin (when combined with source-maps)
      // gives Backpack its human-readable error messages.
      new FriendlyErrorsWebpackPlugin({
        clearConsole: options.env === "development"
      }),
      // The NoEmitOnErrorsPlugin plugin prevents Webpack
      // from printing out compile time stats to the console.
      new webpack.NoEmitOnErrorsPlugin()
    ]
  };
};
