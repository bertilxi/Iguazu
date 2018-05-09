import * as bcrypt from "bcryptjs";

export const Bcrypt = Object.freeze({
  hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  },
  compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
});
