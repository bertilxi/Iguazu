import * as Bookshelf from "bookshelf";
import * as Knex from "knex";
import * as Path from "path";
import * as pg from "pg";

import { store } from "../service";
import { Observable } from "rxjs";

require("dotenv").config();
pg.types.setTypeParser(20, "text", parseInt);

export interface IBookshelf extends Bookshelf {
  model(modelName: string, props: any);
}

export interface WebModel extends Bookshelf.Model<any> {
  findAll: (...args) => Promise<any>;
  findById: (...args) => Promise<any>;
  upsert: (...args) => Promise<any>;
  remove: (...args) => Promise<any>;
  recover: (...args) => Promise<any>;
  forge: (props?: any, options?: any) => any;
  watch: (opts?) => Observable<any>;
  watchAll: (opts?) => Observable<any>;
}

const env = process.env.NODE_ENV || "development";
const rootPath = Path.resolve(process.cwd());
const knexfilePath = Path.join(rootPath, "./knexfile");

export const knexfile = require(knexfilePath)[env];
export const knex = Knex(knexfile);
export const bookshelf: IBookshelf = Bookshelf(knex) as IBookshelf;

bookshelf.plugin("registry");
bookshelf.plugin("visibility");
bookshelf.plugin(require("bookshelf-paranoia"), {
  events: {
    saving: true,
    updating: true,
    saved: true,
    updated: true
  }
});
bookshelf.plugin(require("bookshelf-eloquent"));

store.set("knexfile", knexfile);
store.set("knex", knex);
store.set("bookshelf", bookshelf);
