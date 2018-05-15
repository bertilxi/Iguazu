import { kebabCase } from "lodash";

import { authMiddleware } from "../middleware";
import { store } from "../service";
import { PluginHandler } from "./Plugin";

export function RequestMapping({ path, method = "get" }): MethodDecorator {
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    target[method] = target[method] || [];
    target[method].push({ path, handler: descriptor.value });
  };
}

export function Get(path, options = {}) {
  const method = "get";
  return RequestMapping({ path, method });
}
export function Post(path, options = {}) {
  const method = "post";
  return RequestMapping({ path, method });
}
export function Put(path, options = {}) {
  const method = "put";
  return RequestMapping({ path, method });
}
export function Patch(path, options = {}) {
  const method = "patch";
  return RequestMapping({ path, method });
}
export function Delete(path, options = {}) {
  const method = "delete";
  return RequestMapping({ path, method });
}
export function Options(path, options = {}) {
  const method = "options";
  return RequestMapping({ path, method });
}

export interface Controller {
  path: string;
  handler: PluginHandler;
}
export function Controller({ path = "", secure = true } = {}) {
  return target => {
    const reflectedName = target.name.split("Controller")[0];
    target.prototype.path = path || `/${kebabCase(reflectedName)}`;
    target.prototype.handler = (instance, opts, next) => {
      const withAuth = store.get("withAuth");
      if (withAuth && secure) {
        instance.addHook("preHandler", authMiddleware);
      }
      const methods = ["get", "post", "put", "patch", "delete"];
      methods.forEach(method => {
        target.prototype[method] = target.prototype[method] || [];
        target.prototype[method].forEach(m => {
          instance[method](m.path, m.handler.bind(target.prototype));
        });
      });
      next();
    };

    const controller = new target();
    const controllers = store.get<Controller[]>("controllers") || [];
    controllers.push(controller);
    store.set("controllers", controllers);
  };
}

export interface WebController {
  path: any[];
  handler: PluginHandler;
  get: any[];
  post: any[];
  put: any[];
  patch: any[];
  delete: any[];
}
