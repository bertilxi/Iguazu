import { Repository, BelongsToMany } from "@iguazu/puma";

@Repository({
  hidden: ["password"],
  options: {
    fetch: { withRelated: ["roles"] },
    listenTo: ["Role"],
    disable: ["upsert"]
  }
})
export class UserRepository {
  @BelongsToMany("Role", "user_role")
  public roles;
}

export const User: Repository = new UserRepository() as any;
