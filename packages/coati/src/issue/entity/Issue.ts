import { Repository, WebModel, BelongsTo, HasMany } from "@iguazu/puma";

@Repository({
  options: {
    fetch: { withRelated: ["author", "type", "state", "link", "comments.user"] }
  }
})
export class IssueRepository {
  @BelongsTo("User") public author;
  @BelongsTo("IssueType", "type_id")
  public type;
  @BelongsTo("IssueState", "state_id")
  public state;
  @HasMany("IssueComment") public comments;
  @BelongsTo("Issue") public link;
}

export const Issue: WebModel = new IssueRepository() as any;
