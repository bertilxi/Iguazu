import * as Boom from "boom";
import { Jwt } from "../service";

export const authMiddleware = async (request, reply) => {
  if (process.env.NODE_ENV === "development") {
    return;
  }
  try {
    const token = request.headers.authorization.slice(7);
    request.user = await Jwt.verify(token);
    return;
  } catch (error) {
    throw Boom.unauthorized("Invalid auth token provided.");
  }
};
