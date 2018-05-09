#! /usr/bin/env node
/* tslint:disable: no-console */
import * as webpack from "webpack";
import * as nodemon from "nodemon";
import * as path from "path";
import * as fs from "fs";
import { defaultConfig } from "./webpack";

const once = require("ramda").once;

const options = {
  env: "development"
};

const configPath = path.resolve("iguazu.config.ts");
let userConfig: any = {};

if (fs.existsSync(configPath)) {
  const userConfigModule = require(configPath);
  userConfig = userConfigModule.default || userConfigModule;
}

const serverConfig = userConfig.webpack
  ? userConfig.webpack(defaultConfig(options), options, webpack)
  : defaultConfig(options);

process.on("SIGINT", (process as any).exit);

const serverCompiler = webpack(serverConfig);

const startServer = () => {
  const serverPaths = Object.keys(serverCompiler.options.entry).map(entry =>
    path.join(serverCompiler.options.output.path, `${entry}.js`)
  );
  nodemon({
    script: serverPaths[0],
    watch: serverPaths,
    nodeArgs: process.argv.slice(2)
  }).on("quit", process.exit);
};

const startServerOnce = once((err, stats) => {
  if (err) {
    return;
  }
  startServer();
});
serverCompiler.watch(serverConfig.watchOptions || {}, startServerOnce);
