import { fastify } from "fastify";
import fastifyCors from "@fastify/cors";
import {
  type ZodTypeProvider,
  serializerCompiler,
  jsonSchemaTransform,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createTransaction } from "./http/create-transaction";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors);

app.register(createTransaction);

app.get("/health", (_request, reply) => {
  app.log.info("working");
  reply.send("Server is running properly.");
});
