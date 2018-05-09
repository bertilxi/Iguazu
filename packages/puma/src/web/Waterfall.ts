import * as Boom from "boom";

import { bookshelf } from "../database";
import { iguazu, store } from "../service";
import { Controller, Post } from "./Controller";

export type QueryAction =
  | "findAll"
  | "findById"
  | "upsert"
  | "remove"
  | "recover";

export interface Data {
  id: number;
}

export interface QueryOptions {
  fetch;
}

export interface WaterfallQuery {
  model: string;
  action: QueryAction;
  data: Partial<Data>;
  options?: any;
}

@Controller()
export class WaterfallController {
  @Post("/")
  public async handle(request) {
    const querys: WaterfallQuery[] = request.body;
    const result = [];
    await bookshelf.transaction(async trx => {
      const promises = querys.map(
        ({ model, action, data, options = {} }: WaterfallQuery) => {
          const repository = store
            .get("repositories")
            .find(r => r.name === model);

          if (!repository) {
            throw Boom.badData("Missing model");
          }
          if (!action) {
            throw Boom.badData("Missing action");
          }
          const actionFn = repository.model[action];
          return actionFn({ body: data }, options, trx);
        }
      );

      for (const promise of promises) {
        const [error, partialResult] = await iguazu.to(promise);
        if (error) {
          throw Boom.badData("Transaction failed");
        }
        result.push(partialResult);
      }
    });

    return result;
  }
}
