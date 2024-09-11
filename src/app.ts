import { fastify } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

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

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Dinheirinho",
      description: "Backend service for a finantial apliance",
      version: "1.0.0",
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, { routePrefix: "/docs" });

app.register(fastifyCors);

app.register(createTransaction);

app.get("/health", (_request, reply) => {
  app.log.info("working");
  reply.send("Server is running properly.");
});
