import { Migration } from "@iguazu/puma";

const tableName = "issue_state";

export = new Migration(
  knex => {
    return knex.schema.createTable(tableName, table => {
      table.increments();
      table.timestamps(true, true);
      table
        .boolean("deleted")
        .notNullable()
        .defaultTo("false");

      table.string("name").notNullable();
    });
  },
  knex => knex.schema.dropTable(tableName)
);
