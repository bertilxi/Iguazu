import { Repository, BelongsToMany, WebModel } from "@iguazu/puma";

@Repository({
  options: { fetch: { withRelated: ["users"] } }
})
export class RoleRepository {
  @BelongsToMany("User", "user_role")
  public users;
}

export const Role: WebModel = new RoleRepository() as any;
