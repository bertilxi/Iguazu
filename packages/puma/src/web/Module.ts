import * as boomPlugin from "fastify-boom";
import * as helmetPlugin from "fastify-helmet";

import { SsePlugin } from "../plugin";
import { Controller, Get } from "./Controller";
import { Plugin } from "./Plugin";

export abstract class WebModule {
  public controllers: any[];
  public entities: any[];
  public migrationsPath: string;
  public seedsPath: string;
}

export function Module({
  controllers = [],
  entities = [],
  migrationsPath = "",
  seedsPath = ""
}: Partial<WebModule>) {
  return target => {
    const name = target.name.split("Module")[0];
    target.prototype.name = name;
    target.prototype.controllers = controllers;
    target.prototype.entities = entities;
    target.prototype.migrationsPath = migrationsPath;
    target.prototype.seedsPath = seedsPath;
    Object.freeze(target);
    Object.freeze(target.prototype);
  };
}

export const defaultPlugins = [
  new Plugin(boomPlugin),
  new Plugin(helmetPlugin),
  new Plugin(SsePlugin)
];

@Controller({ path: "/" })
class DefaultController {
  @Get("/")
  public async root() {
    return {
      message: "Welcome to the Iguazu Framework"
    };
  }
}

@Module({
  controllers: [new DefaultController()]
})
export class DefaultModule extends WebModule {}
