import { Repository, HasMany, WebModel } from "@iguazu/puma";

@Repository({
  options: { fetch: { withRelated: ["issues"] } }
})
export class IssueStateRepository {
  @HasMany("Issue", "state_id")
  public issues;
}

export const IssueState: WebModel = new IssueStateRepository() as any;
