import { Migration } from "@iguazu/puma";

const tableName = "issue";

export = new Migration(
  knex => {
    return knex.schema.createTable(tableName, table => {
      table.increments();
      table.timestamps(true, true);
      table
        .boolean("deleted")
        .notNullable()
        .defaultTo("false");
      table.string("title").notNullable();
      table.string("description");
      table.integer("user_id").references("user.id");
      table
        .integer("type_id")
        .references("issue_type.id")
        .defaultTo(1);
      table.integer("state_id").references("issue_state.id");
      table.integer("link_id").references("issue.id");
    });
  },
  knex => knex.schema.dropTable(tableName)
);
