#! /usr/bin/env node
import * as webpack from "webpack";
import * as path from "path";
import * as fs from "fs";
import { defaultConfig } from "./webpack";

process.on("SIGINT", (process as any).exit);

const options = {
  env: process.env.NODE_ENV || "production"
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

serverCompiler.run((error, stats) => {
  if (error || stats.hasErrors()) {
    process.exitCode = 1;
  }
});
