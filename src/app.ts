import fastify from "fastify";
import { userRoutes } from "./routes/user";
import { mealsRoutes } from "./routes/meals";
import cookie from "@fastify/cookie";
export const app = fastify({
  logger: true,
});
app.register(cookie);
const routes = [
  { handler: userRoutes, prefix: "/user" },
  { handler: mealsRoutes, prefix: "/meals" },
];
routes.forEach(({ handler, prefix }) => {
  app.register(handler, { prefix });
});
