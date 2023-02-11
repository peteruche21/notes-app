import { generateNonce, SiweMessage } from "siwe";
import { z } from "zod";
import {
  createTRPCRouter as router,
  publicProcedure,
  protectedProcedure,
} from "../trpc";

const auth = router({
  authNonce: publicProcedure.query(async ({ ctx }) => {
    const currentDate = new Date();
    // Setup Session
    ctx.session.nonce = generateNonce();
    ctx.session.issuedAt = currentDate.toISOString();
    ctx.session.expirationTime = new Date(
      currentDate.getTime() + 5 * 60 * 1000 // 5 minutes from the current time
    ).toISOString();

    // Save Session
    await ctx.session.save();

    // Return
    return {
      nonce: ctx.session.nonce,
      issuedAt: ctx.session.issuedAt,
      expirationTime: ctx.session.expirationTime,
    };
  }),

  authVerified: publicProcedure
    .input(z.string().length(42).optional())
    .query(({ ctx, input }) => {
      if (input && ctx.session.siwe?.address === input) {
        return { ok: true };
      }
      return { ok: false };
    }),

  authVerify: publicProcedure
    .input(
      z.object({
        message: z.object({
          domain: z.string(),
          address: z.string().length(42),
          statement: z.string().optional(),
          uri: z.string(),
          version: z.string(),
          chainId: z.number(),
          nonce: z.string(),
          issuedAt: z.string().optional(),
          expirationTime: z.string().optional(),
          notBefore: z.string().optional(),
          requestId: z.string().optional(),
          resources: z.array(z.string()).optional(),
          signature: z.string().optional(),
          type: z.literal("Personal signature").optional(),
        }),
        signature: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const siweMessage = new SiweMessage(input.message);
        const res = await siweMessage.verify({
          signature: input.signature,
          domain: input.message.domain,
          nonce: input.message.nonce,
        });
        if (!res.success) {
          throw new Error("Invalid nonce.");
        }
        const fields = res.data;
        // adds users siwe details to session
        ctx.session.siwe = fields;
        // persist user weave identity
        const { identity, tx } = await ctx.DB.createTempAddress(fields.address);
        console.log(tx);
        // adds users weavedb details to session
        ctx.session.weavedbUser = {
          wallet: fields.address,
          identity,
        };
        // sets users linked address in session
        ctx.session.weavedbUser.identity.linked_address = fields.address;
        // saves session
        await ctx.session.save();
        return { ok: true };
      } catch (error: unknown) {
        return {
          ok: false,
          error: (error as Error)?.message ?? "Unknown error",
        };
      }
    }),

  authDetails: protectedProcedure.query(({ ctx }) => {
    const siwe = ctx.session.siwe;
    return {
      address: siwe?.address,
      chainid: siwe?.chainId,
      issuedAt: siwe?.issuedAt,
      expires: siwe?.expirationTime,
      nonce: siwe?.nonce,
      domain: siwe?.domain,
    };
  }),

  authLogout: publicProcedure.query(({ ctx }) => {
    ctx.session.destroy();
    return { ok: true };
  }),
});

export const authRouter = router({
  auth,
});
