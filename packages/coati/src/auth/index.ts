import { Module } from "@iguazu/puma";
import { resolve } from "path";

import { authController } from "./controller";
import { Role, User } from "./entity";

@Module({
  controllers: [authController],
  entities: [User, Role],
  migrationsPath: resolve(__dirname, "./migration"),
  seedsPath: resolve(__dirname, "./seed")
})
export class AuthModule {}
