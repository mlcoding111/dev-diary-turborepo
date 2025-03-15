import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();
const publicProcedure = t.procedure;

const appRouter = t.router({
  products: t.router({
    createProduct: publicProcedure.input(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      price: z.number(),
    })).output(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      price: z.number(),
    })).mutation(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
  })
});
export type AppRouter = typeof appRouter;

