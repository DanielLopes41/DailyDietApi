import { FastifyReply, FastifyRequest } from "fastify";
import { knex } from "../../database";
import crypto from "node:crypto";
import { format } from "date-fns";
import z from "zod";
interface Params {
  id: string;
}
export class MealsController {
  async store(request: FastifyRequest, reply: FastifyReply) {
    try {
      const createUserBodySchema = z.object({
        name: z
          .string()
          .max(50, { message: "O número máximo de caracteres é 50." }),
        description: z
          .string()
          .max(250, { message: "O número máximo de caracteres é 100." }),
        isOnDiet: z.boolean(),
      });
      const { name, isOnDiet, description } = createUserBodySchema.parse(
        request.body
      );
      const tempValue = crypto.randomUUID();
      const [meal] = await knex("meals")
        .insert({
          description,
          id: crypto.randomUUID(),
          isOnDiet,
          name,
          session_id: tempValue,
        })
        .returning("*");
      return reply.status(200).send(meal);
    } catch (e) {
      return reply.send(e);
    }
  }
  async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const meals = await knex("meals").select("*");
      return reply.status(200).send(meals);
    } catch (e) {
      return reply.send(e);
    }
  }
  async show(request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const meals = await knex("meals").where({ id }).first();
      if (!meals) {
        return reply.status(404).send({ message: "Meal not found" });
      }
      return reply.status(200).send(meals);
    } catch (e) {
      return reply.send(e);
    }
  }
  async update(
    request: FastifyRequest<{ Params: Params }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const createUserBodySchema = z.object({
        name: z
          .string()
          .max(50, { message: "O número máximo de caracteres é 50." }),
        description: z
          .string()
          .max(250, { message: "O número máximo de caracteres é 100." }),
        isOnDiet: z.boolean(),
        updated_at: z
          .date()
          .default(() => new Date())
          .transform((date) => format(date, "yyyy-MM-dd HH:mm:ss")),
      });
      const { name, isOnDiet, description, updated_at } =
        createUserBodySchema.parse(request.body);
      const [meal] = await knex("meals")
        .where({ id })
        .update({
          description,
          isOnDiet,
          name,
          updated_at,
        })
        .returning("*");
      return reply.status(200).send(meal);
    } catch (e) {
      return reply.send(e);
    }
  }
  async delete(
    request: FastifyRequest<{ Params: Params }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const meal = await knex("meals").where({ id }).first();

      if (!meal) {
        return reply.status(404).send({ message: "Meal not found" });
      }

      await knex("meals").where({ id }).delete();
      return reply.status(200).send({ message: "Meal deleted successfully" });
    } catch (e) {
      return reply.send(e);
    }
  }
  async metrics(
    request: FastifyRequest<{ Params: Params }>,
    reply: FastifyReply
  ) {
    try {
      const meals = await knex("meals").select("*");
      const bestOnDietSequence = meals.reduce(
        (acc, meal) => {
          if (meal.isOnDiet) {
            acc.currentSequence += 1;
          } else {
            acc.currentSequence = 0;
          }

          if (acc.currentSequence > acc.bestOnDietSequence) {
            acc.bestOnDietSequence = acc.currentSequence;
          }

          return acc;
        },
        { bestOnDietSequence: 0, currentSequence: 0 }
      );
      return reply.status(200).send({
        Length: meals.length,
        MealsInDiet: meals.reduce((acc, currentMeal) => {
          return currentMeal.isOnDiet ? acc + 1 : acc;
        }, 0),
        MealsOutOfDiet: meals.reduce((acc, currentMeal) => {
          return currentMeal.isOnDiet ? acc : acc + 1;
        }, 0),
        MaxGoals: bestOnDietSequence,
      });
    } catch (e) {
      return reply.send(e);
    }
  }
}
export default new MealsController();
