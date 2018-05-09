import { Repository, WebModel, HasMany } from "@iguazu/puma";

@Repository({
  options: { fetch: { withRelated: ["issues"] } }
})
export class IssueTypeRepository {
  @HasMany("Issue", "type_id")
  public issues;
}

export const IssueType: WebModel = new IssueTypeRepository() as any;
