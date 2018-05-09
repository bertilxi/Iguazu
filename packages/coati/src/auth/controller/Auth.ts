import { Bcrypt, Controller, Jwt, Post } from "@iguazu/puma";
import * as Boom from "boom";

import { User } from "../entity";

@Controller()
export class AuthController {
  @Post("/login")
  public async login(request, reply) {
    const email = request.body.email || "";
    const username = request.body.username || "";
    const user = await User.query(qb =>
      qb.where("email", email).orWhere("username", username)
    ).fetch({ withRelated: ["roles"] });

    if (!user) {
      throw Boom.unauthorized("User not exists");
    }

    const matches = await Bcrypt.compare(
      request.body.password,
      user.get("password")
    );

    if (matches) {
      const jwt = await Jwt.sign(user.get("email"));
      user.set("password", undefined);
      user.set("token", jwt);
      return reply.send(user);
    }

    throw Boom.unauthorized("Bad credentials");
  }
  @Post("/register")
  public async register(request, reply) {
    const user = await User.query(qb => {
      qb
        .where("email", request.body.email)
        .orWhere("username", request.body.username);
    }).fetch();

    if (user) {
      throw Boom.badData("User already exists");
    }

    const newUser = { ...request.body };
    newUser.password = await Bcrypt.hash(request.body.password);
    return await User.forge(newUser).save();
  }
  @Post("/modify")
  public async modify(request, reply) {
    const userData = request.body;
    const user = await User.where("id", userData.id).fetch();

    if (userData.id) {
      throw Boom.badData("Invalid user data");
    }

    if (!user) {
      throw Boom.badData("User not exists");
    }

    if (userData.password) {
      const matches = await Bcrypt.compare(
        userData.oldPassword,
        user.get("password")
      );
      if (matches) {
        userData.password = await Bcrypt.hash(userData.password);
      }
    }

    return await User.forge(userData).save();
  }
  @Post("/logout")
  public async logout(request, reply) {
    return { ok: true };
  }
}

export const authController = new AuthController();
