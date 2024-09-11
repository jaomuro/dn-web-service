import { prisma } from "@/lib/prisma";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function createTransaction(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/transactions",
    {
      schema: {
        body: z.object({
          title: z.string(),
          description: z.string(),
          type: z.enum(["incomes", "outcomes"]),
          category: z.string(),
          value: z.coerce.number(),
          date: z.coerce.date(),
          isDone: z.boolean().default(false),
          isFixed: z.boolean().default(false),
          isRepeated: z.boolean().default(false),
          repeatedFor: z.coerce.number().optional(),
          repeatedNumber: z.coerce.number().optional(),
          accountId: z.coerce.number(),
        }),
      },
    },
    async (request, reply) => {
      const {
        title,
        description,
        type,
        category,
        value,
        date,
        isDone,
        isFixed,
        isRepeated,
        repeatedFor,
        repeatedNumber,
        accountId,
      } = request.body;

      const createdTransaction = await prisma.transaction.create({
        data: {
          title,
          description,
          type,
          category,
          value,
          date,
          isDone,
          isFixed,
          isRepeated,
          repeatedFor,
          repeatedNumber,
          accountId,
        },
      });

      return reply.status(201).send();
    },
  );
}
