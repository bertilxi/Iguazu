/* tslint:disable: no-console */
import { resolve, join } from "path";

const rootPath = resolve(process.cwd());
const buildPath = join(rootPath, "build");
const publicBuildPath = join(buildPath, "public");

export const paths = {
  rootPath,
  buildPath,
  publicBuildPath,
  publicSrcPath: join(rootPath, "public"),
  serverSrcPath: join(rootPath, "src"),
  serverBuildPath: buildPath,
  userNodeModulesPath: join(rootPath, "node_modules"),
  publicPath: "/",
  serverUrl: "http://localhost:3000"
};
