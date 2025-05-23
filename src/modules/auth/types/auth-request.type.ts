import { FastifyRequest } from "fastify";

export type AuthRequest = FastifyRequest & {
  user: {
    userID: number;
  };
};
