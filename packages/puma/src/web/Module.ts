import * as boomPlugin from "fastify-boom";
import * as helmetPlugin from "fastify-helmet";

import { Controller, Get } from "./Controller";
import { Plugin } from "./Plugin";
import { store } from "../service";

export interface Module {
  controllers: any[];
  entities: any[];
  migrationsPath: string;
  seedsPath: string;
}

export function Module({
  controllers = [],
  entities = [],
  migrationsPath = "",
  seedsPath = ""
}: Partial<Module>) {
  return target => {
    const name = target.name.split("Module")[0];
    target.prototype.name = name;
    target.prototype.controllers = controllers;
    target.prototype.entities = entities;
    target.prototype.migrationsPath = migrationsPath;
    target.prototype.seedsPath = seedsPath;
    Object.freeze(target);
    Object.freeze(target.prototype);

    const module = new target();
    const modules = store.get<Module[]>("modules") || [];
    modules.push(module);
    store.set("modules", modules);
  };
}

export const defaultPlugins = [
  new Plugin(boomPlugin),
  new Plugin(helmetPlugin)
];

@Controller({ path: "/", secure: false })
class DefaultController {
  @Get("/")
  public async root() {
    return {
      message: "Welcome to the Iguazu Framework"
    };
  }
}

@Module({
  controllers: [DefaultController]
})
export class DefaultModule {}
