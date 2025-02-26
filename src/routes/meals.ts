import { FastifyInstance } from "fastify";
import MealsController from "../controllers/MealsController";

export async function mealsRoutes(app: FastifyInstance) {
  app.post("/", MealsController.store);
  app.get("/", MealsController.index);
  app.get("/:id", MealsController.show);
  app.put("/:id", MealsController.update);
  app.delete("/:id", MealsController.delete);
  app.get("/metrics", MealsController.metrics);
}
