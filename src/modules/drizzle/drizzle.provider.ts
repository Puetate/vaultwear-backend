import { envs } from "@commons/config";
import { TransactionalAdapterDrizzleOrm } from "@nestjs-cls/transactional-adapter-drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export const Drizzle = Symbol("DrizzleProvider");

const connectionString = envs.DATABASE_URL;
const pool = new Pool({ connectionString });
const drizzleClient = drizzle(pool, { schema });

export const DrizzleProvider = {
  provide: Drizzle,
  useFactory: () => {
    return drizzleClient;
  }
};

type DrizzleClient = typeof drizzleClient;
export type DrizzleAdapter = TransactionalAdapterDrizzleOrm<DrizzleClient>;
