import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
      session_id: string;
    };
    meals: {
      id: string;
      name: string;
      session_id: string;
      description: string;
      isOnDiet: boolean;
      updated_at: string;
    };
  }
}
