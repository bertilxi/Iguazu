import * as cors from "cors";
import * as fastify from "fastify";
import { FastifyInstance } from "fastify";
import { Constructor } from "./decorator";
import * as IO from "socket.io";
import { store } from "./service";
import {
  WaterfallController,
  WebController,
  WebModule,
  DefaultModule,
  defaultPlugins,
  Plugin
} from "./web";

function registerPlugins() {
  const server: FastifyInstance = store.get("server");
  const plugins: Plugin[] = store.get("plugins");

  plugins.forEach(plugin => {
    server.register(plugin.handler, plugin.options);
  });
}

function registerControllers() {
  const server: FastifyInstance = store.get("server");
  const controllers: WebController[] = store.get("controllers");
  const waterfall: any = new WaterfallController();

  if (store.get("batch")) {
    controllers.unshift(waterfall);
  }

  controllers.forEach(controller => {
    server.register(controller.handler, {
      prefix: controller.path
    });
  });
}

function registerEntities() {
  const server: FastifyInstance = store.get("server");
  const entities: any[] = store.get("entities");

  entities.forEach(({ controller, options, sseController }) => {
    server.register(controller.handler, {
      prefix: controller.path
    });
    if (options.sse && sseController) {
      server.register(sseController.handler, {
        prefix: sseController.path
      });
    }
  });
}

function startServer() {
  const server: FastifyInstance = store.get("server");
  const port: string = store.get("port");

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
  modules: WebModule[];
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

  if (withDefault) {
    modules.unshift(new DefaultModule());
  }

  store.set("io", io);
  store.set("withAuth", withAuth);
  store.set("isDev", isDev);
  store.set("sse", sse);
  store.set("batch", batch);
  store.set("port", port);
  store.set("server", server);
  store.set("plugins", [...defaultPlugins, ...plugins]);
  store.set(
    "controllers",
    modules
      .map(m => m.controllers)
      .reduce((flat, toFlatten) => flat.concat(toFlatten))
  );
  store.set(
    "entities",
    modules
      .map(m => m.entities)
      .reduce((flat, toFlatten) => flat.concat(toFlatten))
  );

  registerPlugins();
  registerEntities();
  registerControllers();

  return startServer();
}

export function Application(options: BootstrapOptions) {
  return (target: Constructor) => {
    bootstrap(options);
  };
}
