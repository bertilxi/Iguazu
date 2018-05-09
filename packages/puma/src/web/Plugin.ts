import * as fastify from "fastify";
import * as http from "http";
import * as http2 from "http2";
import { Frozen } from "../decorator";

export type HttpServer = http.Server | http2.Http2Server;
export type HttpRequest = http.IncomingMessage | http2.Http2ServerRequest;
export type HttpResponse = http.ServerResponse | http2.Http2ServerResponse;

export type PluginHandler = fastify.Plugin<
  HttpServer,
  HttpRequest,
  HttpResponse,
  any
>;

@Frozen
export class Plugin {
  constructor(public handler: PluginHandler, public options?: any) {}
}
