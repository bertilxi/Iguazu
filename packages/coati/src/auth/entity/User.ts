import { Repository, BelongsToMany, WebModel } from "@iguazu/puma";

@Repository({
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

export const User: WebModel = new UserRepository() as any;
