import * as Bookshelf from "bookshelf";
import * as Knex from "knex";
import * as Path from "path";
import * as pg from "pg";

import { store } from "../service";

require("dotenv").config();
pg.types.setTypeParser(20, "text", parseInt);

export interface IBookshelf extends Bookshelf {
  model(modelName: string, props: any);
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
