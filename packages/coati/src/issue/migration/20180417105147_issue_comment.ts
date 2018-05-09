import { Migration } from "@iguazu/puma";

const tableName = "issue_comment";

export = new Migration(
  knex => {
    return knex.schema.createTable(tableName, table => {
      table.increments();
      table.timestamps(true, true);
      table
        .boolean("deleted")
        .notNullable()
        .defaultTo("false");

      table.integer("user_id").references("user.id");
      table.integer("issue_id").references("issue.id");
      table.string("content").notNullable();
    });
  },
  knex => knex.schema.dropTable(tableName)
);
