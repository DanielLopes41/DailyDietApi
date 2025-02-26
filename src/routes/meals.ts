import { FastifyInstance } from "fastify";
import MealsController from "../controllers/MealsController";
import { checkSessionIdExists } from "../middlewares/check-session_id-exists";

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", checkSessionIdExists);

  app.post("/", MealsController.store);
  app.get("/", MealsController.index);
  app.get("/:id", MealsController.show);
  app.put("/:id", MealsController.update);
  app.delete("/:id", MealsController.delete);
  app.get("/metrics", MealsController.metrics);
}
