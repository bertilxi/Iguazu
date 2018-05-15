import * as cors from "cors";
import * as fastify from "fastify";
import { FastifyInstance } from "fastify";
import * as IO from "socket.io";
import { Constructor } from "./decorator";
import { store } from "./service";
import { Controller, Plugin, defaultPlugins } from "./web";
import "./web/Module";
import "./web/Waterfall";

function registerPlugins() {
  const server: FastifyInstance = store.get("server");
  const plugins: Plugin[] = store.get("plugins") || [];

  plugins.forEach(plugin => {
    server.register(plugin.handler, plugin.options);
  });
}

function registerControllers() {
  const server: FastifyInstance = store.get("server");
  const controllers = store.get<Controller[]>("controllers") || [];

  controllers.forEach(controller => {
    server.register(controller.handler, {
      prefix: controller.path
    });
  });
}

function startServer() {
  const server = store.get<FastifyInstance>("server");
  const port = store.get<string>("port");

  server
    .ready()
    .then(() => {
      server.log.info("Plugins loaded");
    })
    .catch(error => {
      server.log.error("Error loading Plugins", error);
    });

  server.listen(port, error => {
    if (error) {
      server.log.error(error);
      process.exit(1);
      return;
    }
  });
}

export interface BootstrapOptions {
  modules: any[];
  port?: string;
  withDefault?: boolean;
  withAuth?: boolean;
  rest?: boolean;
  sse?: boolean;
  batch?: boolean;
  serverOptions?: any;
  prefix?: string;
  plugins?: Plugin[];
}

export function bootstrap({
  modules = [],
  withDefault = true,
  withAuth = true,
  serverOptions = {},
  rest = true,
  sse = true,
  batch = true,
  port = process.env.PORT || "3000",
  plugins = []
}: BootstrapOptions): void {
  const isDev = process.env.NODE_ENV !== "production";
  const opts = isDev
    ? {
        logger: {
          enabled: true,
          level: "debug",
          timestamp: false,
          prettyPrint: true,
          base: null
        }
      }
    : {
        logger: {
          enabled: true,
          level: "info"
        }
      };

  const options = Object.assign({}, opts, serverOptions);
  const server = fastify(options);
  const io = IO(server.server);

  if (isDev) {
    server.use(cors());
  }

  store.set("io", io);
  store.set("withAuth", withAuth);
  store.set("isDev", isDev);
  store.set("batch", batch);
  store.set("port", port);
  store.set("server", server);
  store.set("plugins", [...defaultPlugins, ...plugins]);

  registerPlugins();
  registerControllers();

  return startServer();
}

export function Application(options: BootstrapOptions) {
  return (target: Constructor) => {
    bootstrap(options);
  };
}
