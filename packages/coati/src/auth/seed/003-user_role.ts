import { Seed } from "@iguazu/puma";

const tableName = "user_role";

export = new Seed(async knex => {
  await knex(tableName).del();
  return knex(tableName).insert([{ user_id: 1, role_id: 1 }]);
});
