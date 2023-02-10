import { z } from "zod";
import { createTRPCRouter as router, protectedProcedure } from "../trpc";

const notes = router({
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const note = await ctx.DB.get("notes", input);
      return { ok: true, data: note };
    } catch (error: unknown) {
      return {
        ok: false,
        error: (error as Error)?.message ?? "Unknown error",
      };
    }
  }),
  all: protectedProcedure.query(async ({ ctx }) => {
    try {
      const allNotes = await ctx.DB.cget("notes", ["updated_at", "desc"]);
      return { ok: true, data: allNotes };
    } catch (error: unknown) {
      return {
        ok: false,
        error: (error as Error)?.message ?? "Unknown error",
      };
    }
  }),
  me: protectedProcedure.query(async ({ ctx }) => {
    try {
      const myNotes = await ctx.DB.cget(
        "notes",
        ["owner_address", "=", ctx.session.siwe?.address.toLowerCase()],
        ["updated_at", "desc"]
      );
      return { ok: true, data: myNotes };
    } catch (error: unknown) {
      return {
        ok: false,
        error: (error as Error)?.message ?? "Unknown error",
      };
    }
  }),
  add: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
        private: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(ctx.DB.signer());
      try {
        await ctx.DB.add(
          {
            note_id: Date.now().toString(),
            created_at: ctx.DB.ts(),
            updated_at: ctx.DB.ts(),
            owner_address: ctx.DB.signer(),
            title: input.title,
            body: input.body,
            private: input.private,
            likes: 0,
          },
          "notes",
          {
            wallet: ctx.session.weavedbUser?.wallet as string,
            privateKey: ctx.session.weavedbUser?.identity.privateKey as string,
          }
        );
        return { ok: true };
      } catch (error: unknown) {
        return {
          ok: false,
          error: (error as Error)?.message ?? "Unknown error",
        };
      }
    }),
  update: protectedProcedure
    .input(
      z.object({
        data: z.object({
          title: z.string().optional(),
          body: z.string().optional(),
          private: z.boolean().default(false),
        }),
        docid: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.DB.update(input.data, "tasks", input.docid, {
          wallet: ctx.session.weavedbUser?.wallet as string,
          privateKey: ctx.session.weavedbUser?.identity.privateKey as string,
        });
        return { ok: true };
      } catch (error: unknown) {
        return {
          ok: false,
          error: (error as Error)?.message ?? "Unknown error",
        };
      }
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.DB.delete("notes", input, {
          wallet: ctx.session.weavedbUser?.wallet as string,
          privateKey: ctx.session.weavedbUser?.identity.privateKey as string,
        });
        return { ok: true };
      } catch (error: unknown) {
        return {
          ok: false,
          error: (error as Error)?.message ?? "Unknown error",
        };
      }
    }),
});

export const notesRouter = router({
  notes,
});
