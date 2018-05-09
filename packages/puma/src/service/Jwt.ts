import * as jwt from "jsonwebtoken";

export const Jwt = Object.freeze({
  sign(payload: object | string) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        (error: Error, encoded: string) =>
          error ? reject(error) : resolve(encoded)
      );
    });
  },
  verify(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        process.env.JWT_SECRET,
        (error: Error, decoded: object | string) =>
          error ? reject(error) : resolve(decoded)
      );
    });
  }
});
