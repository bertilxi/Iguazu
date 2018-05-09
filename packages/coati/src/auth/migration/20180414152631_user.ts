import { Migration } from "@iguazu/puma";

const tableName = "user";

export = new Migration(
  knex => {
    return knex.schema.createTable(tableName, table => {
      table.increments();
      table.timestamps(true, true);
      table.timestamp("deleted_at");
      table
        .boolean("deleted")
        .notNullable()
        .defaultTo("false");

      table.string("username").unique();
      table.string("email").unique();
      table.string("name").notNullable();
      table.string("password").notNullable();
      table.string("locale");
    });
  },
  knex => knex.schema.dropTableIfExists(tableName)
);
