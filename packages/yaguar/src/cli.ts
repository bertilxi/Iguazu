#!/usr/bin/env node
/* tslint:disable: no-console */

import * as Liftoff from "liftoff";
import * as commander from "commander";
import * as path from "path";
import chalk from "chalk";
import * as spawn from "cross-spawn";

const argv = require("minimist")(process.argv.slice(2));

let config;

const Iguazu = new Liftoff({
  name: "yaguar",
  moduleName: "@iguazu/yaguar",
  configName: "knexfile",
  processTitle: "yaguar",
  extensions: require("interpret").jsVariants,
  v8flags: require("v8flags")
})
  .on("require", (name, module) => {
    console.log("Loading:", name);
  })
  .on("requireFail", (name, err) => {
    console.log("Unable to load:", name, err);
  })
  .on("respawn", (flags, child) => {
    console.log("Detected node flags:", flags);
    console.log("Respawned to PID:", child.pid);
  });

Iguazu.launch(
  {
    cwd: argv.cwd,
    configPath: argv.iguazufile,
    require: argv.require,
    completion: argv.completion,
    verbose: argv.verbose
  },
  invoke
);

function initKnex(
  mConfig,
  { name = "anonymous", migrationsPath = "", seedsPath = "" } = {}
) {
  const knex = require("knex");

  if (migrationsPath) {
    mConfig.migrations = {
      directory: migrationsPath,
      tableName: `${name.toLowerCase()}_migrations`
    };
  }

  if (seedsPath) {
    mConfig.seeds = {
      directory: seedsPath
    };
  }
  return knex(mConfig);
}

function exit(text) {
  if (text instanceof Error) {
    console.error(chalk.red(text.stack));
  } else {
    console.error(chalk.red(text));
  }
  process.exit(1);
}

function success(text) {
  console.log(text);
}

function to(promise) {
  return promise.then(data => [null, data]).catch(err => [err]);
}

function invoke(env) {
  if (argv.verbose) {
    console.log("LIFTOFF SETTINGS:", this);
    console.log("CLI OPTIONS:", argv);
    console.log("CWD:", env.cwd);
    console.log("LOCAL MODULES PRELOADED:", env.require);
    console.log("SEARCHING FOR:", env.configNameRegex);
    console.log("FOUND CONFIG AT:", env.configPath);
    console.log("CONFIG BASE DIR:", env.configBase);
    console.log("YOUR LOCAL MODULE IS LOCATED:", env.modulePath);
    console.log("LOCAL PACKAGE.JSON:", env.modulePackage);
    console.log("CLI PACKAGE.JSON", require("../../package"));
  }

  if (process.cwd() !== env.cwd) {
    process.chdir(env.cwd);
    console.log("Working directory changed to", env.cwd);
  }

  if (!env.modulePath) {
    console.log("Local ", Iguazu.moduleName, " module not found in: ", env.cwd);
    process.exit(1);
  }

  if (env.configPath) {
    const configFile = require(env.configPath);
    const environment = process.env.NODE_ENV || "development";
    config = configFile[environment];
  } else {
    console.log("No ", Iguazu.configName, " found.");
  }

  const rootPath = path.resolve(process.cwd());
  const modulesPath = path.resolve(rootPath, "./src/module");

  commander
    .option("--debug", "Run with debugging.")
    .option("--knexfile [path]", "Specify the iguazufile path.")
    .option("--cwd [path]", "Specify the working directory.")
    .option(
      "--env [name]",
      "environment, default: process.env.NODE_ENV || development"
    );

  commander
    .command("dev")
    .description("Run dev server.")
    .action(() => {
      const args = process.argv.slice(3);
      const bin = require.resolve(path.join(__dirname, "dev.js"));
      const proc = spawn("node", [bin].concat(args), { stdio: "inherit" });
      proc.on("close", code => process.exit(code));
      proc.on("error", err => {
        console.error(err);
        process.exit(1);
      });
      return proc;
    });

  commander
    .command("build")
    .description("Build production bundle.")
    .action(() => {
      const args = process.argv.slice(3);
      const bin = require.resolve(path.join(__dirname, "build.js"));
      const proc = spawn("node", [bin].concat(args), { stdio: "inherit" });
      proc.on("close", code => process.exit(code));
      proc.on("error", err => {
        console.error(err);
        process.exit(1);
      });
      return proc;
    });

  commander
    .command("migrate:latest")
    .description("Run all migrations that have not yet been run.")
    .action(async () => {
      const modules: any[] = require(modulesPath).modules;
      for (const module of modules) {
        const { name, migrationsPath } = module;
        if (!migrationsPath) {
          return;
        }

        const client = initKnex(config, { name, migrationsPath });
        const promise = client.migrate.latest().spread((batchNo, log: any) => {
          if (log.length === 0) {
            success(chalk.cyan("Already up to date"));
          }
          success(
            chalk.green(`Module ${name} run: ${log.length} migrations \n`) +
              chalk.cyan(log.join("\n"))
          );
        });
        const [error] = await to(promise);
        if (error) {
          console.log(chalk.red(` > Error : ${error}`));
        } else {
          console.log(chalk.green(` > Success`));
        }
      }

      process.exit(0);
    });

  commander
    .command("migrate:rollback")
    .description("Rollback the last set of migrations performed.")
    .action(async () => {
      const modules: any[] = require(modulesPath).modules;
      const reversedModules = modules.reverse();
      for (const module of reversedModules) {
        const { name, migrationsPath } = module;
        if (!migrationsPath) {
          return;
        }

        const client = initKnex(config, { name, migrationsPath });

        const promise = client.migrate
          .rollback()
          .spread((batchNo, log: any) => {
            if (log.length === 0) {
              success(chalk.cyan("Already at the base migration"));
            }
            success(
              chalk.green(
                `Module ${name} rolled back: ${log.length} migrations \n`
              ) + chalk.cyan(log.join("\n"))
            );
          });
        const [error] = await to(promise);
        if (error) {
          console.log(chalk.red(` > Error : ${error}`));
        } else {
          console.log(chalk.green(` > Success`));
        }
      }

      process.exit(0);
    });

  commander
    .command("migrate:currentVersion")
    .description("View the current version for the migration.")
    .action(async () => {
      const modules: any[] = require(modulesPath).modules;
      for (const module of modules) {
        const { name, migrationsPath } = module;
        if (!migrationsPath) {
          return;
        }

        const client = initKnex(config, { name, migrationsPath });
        const promise = client.migrate.currentVersion().then(version => {
          success(chalk.green("Current Version: ") + chalk.blue(version));
        });
        const [error] = await to(promise);
        if (error) {
          console.log(chalk.red(` > Error : ${error}`));
        } else {
          console.log(chalk.green(` > Success`));
        }
      }

      process.exit(0);
    });

  commander
    .command("seed:run")
    .description("Run seed files.")
    .action(async () => {
      const modules: any[] = require(modulesPath).modules;
      for (const module of modules) {
        const { name, seedsPath } = module;
        if (!seedsPath) {
          return;
        }

        console.log(name);

        const client = initKnex(config, { name, seedsPath });
        const promise = client.seed.run().spread(log => {
          if (log.length === 0) {
            success(chalk.cyan("No seed files exist"));
          }
          success(
            chalk.green(
              `Ran ${log.length} seed files \n${chalk.cyan(log.join("\n"))}`
            )
          );
        });
        const [error] = await to(promise);
        if (error) {
          console.log(chalk.red(` > Error : ${error}`));
        } else {
          console.log(chalk.green(` > Success`));
        }
      }

      process.exit(0);
    });

  commander.parse(process.argv);

  if (!process.argv.slice(2).length) {
    commander.outputHelp();
    exit("Unknown command-line options, exiting");
  }
}
