import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().min(1),
  REFRESH_JWT_SECRET: z.string().min(1),
  REFRESH_JWT_EXPIRES_IN: z.string().min(1),
  COOKIE_SECRET: z.string().min(1),
  NODE_ENV: z.enum(["development", "production", "test"])
});

type EnvSchema = z.infer<typeof envSchema>;

const { error, data } = envSchema.safeParse({
  ...process.env,
  TRANSPORT_SERVERS: process.env.TRANSPORT_SERVERS?.split(",") ?? []
});

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

export const envs: EnvSchema = data;
