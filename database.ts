import { Knex, knex as setupknex } from "knex";
export const config: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: "./db/app.db",
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
};

export const knex = setupknex(config);
