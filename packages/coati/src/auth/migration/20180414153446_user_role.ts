import { Migration } from "@iguazu/puma";

const tableName = "user_role";

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

      table.integer("user_id").references("user.id");
      table.integer("role_id").references("role.id");
    });
  },
  knex => knex.schema.dropTableIfExists(tableName)
);
