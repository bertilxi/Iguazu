import { Bcrypt, Seed } from "@iguazu/puma";

const tableName = "user";

export = new Seed(async knex => {
  await knex(tableName).del();
  return knex(tableName).insert([
    {
      email: "admin",
      name: "System Admin",
      password: await Bcrypt.hash("admin"),
      username: "admin",
      locale: "en"
    }
  ]);
});
