import { FastifyInstance } from "fastify";
import UserController from "../controllers/UserController";

export async function userRoutes(app: FastifyInstance) {
  app.post("/", UserController.store);
}
