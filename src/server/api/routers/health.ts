import { createTRPCRouter as router, publicProcedure } from "../trpc";

const health = router({
  server: publicProcedure.query(() => {
    return { ok: true };
  }),
  db: publicProcedure.query(async ({ ctx }) => {
    try {
      await ctx.DB.getInfo();
      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  }),
});

export const healthRouter = router({
  health,
});
