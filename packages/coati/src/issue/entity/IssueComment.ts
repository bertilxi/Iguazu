import { Repository, BelongsTo, WebModel } from "@iguazu/puma";

@Repository({
  options: { fetch: { withRelated: ["issue", "user"] } }
})
export class IssueCommentRepository {
  @BelongsTo("Issue") public issue;
  @BelongsTo("User") public user;
}

export const IssueComment: WebModel = new IssueCommentRepository() as any;
