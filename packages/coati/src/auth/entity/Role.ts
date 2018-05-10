import { BelongsToMany, Repository } from "@iguazu/puma";

@Repository({
  options: { fetch: { withRelated: ["users"] } }
})
export class RoleRepository {
  @BelongsToMany("User", "user_role")
  public users;
}

export const Role: Repository = new RoleRepository() as any;
