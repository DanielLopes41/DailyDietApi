import { FastifyReply, FastifyRequest } from "fastify";
import { knex } from "../../database";
import crypto from "node:crypto";
import z from "zod";
export class UserController {
  async store(request: FastifyRequest, reply: FastifyReply) {
    try {
      const createUserBodySchema = z.object({
        email: z.string().email(),
        name: z.string(),
      });
      const { email, name } = createUserBodySchema.parse(request.body);
      const tempValueSession = crypto.randomUUID();
      const userByEmail = await knex("users").where({ email }).first();
      if (userByEmail) {
        return reply.status(409).send({ message: "E-mail já cadastrado" });
      }
      const [newUser] = await knex("users")
        .insert({
          id: crypto.randomUUID(),
          email,
          name,
          session_id: tempValueSession,
        })
        .returning("*");
      return reply.status(200).send(newUser);
    } catch (e) {
      return reply.send(e);
    }
  }
}
export default new UserController();
