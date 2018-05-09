import { Module } from "@iguazu/puma";
import { resolve } from "path";

import { Issue, IssueComment, IssueState, IssueType } from "./entity";

@Module({
  controllers: [],
  entities: [Issue, IssueComment, IssueState, IssueType],
  migrationsPath: resolve(__dirname, "./migration"),
  seedsPath: resolve(__dirname, "./seed")
})
export class IssueModule {}
