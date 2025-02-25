import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("meals", (table) => {
    table.uuid("id").primary(),
      table.string("name").notNullable(),
      table.string("session_id").notNullable().index(),
      table.string("description");
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
    table.boolean("isOnDiet").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("meals");
}
