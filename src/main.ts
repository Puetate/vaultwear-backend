import { CORS, envs } from "@commons/config";
import "@commons/config/envs";
import { AllExceptionsFilter } from "@commons/filters";
import fastifyCookie from "@fastify/cookie";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import morgan from "morgan";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    })
  );

  app.setGlobalPrefix("api");
  app.use(morgan("dev"));
  app.enableCors(CORS);

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.register(fastifyCookie, {
    secret: envs.COOKIE_SECRET
  });

  const config = new DocumentBuilder()
    .setTitle("VAULT WEAR DOCUMENTATION")
    .setDescription("The vault wear API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("documentation", app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true
    }
  });

  await app.listen(process.env.PORT || 3000, process.env.HOST || "0.0.0.0");
  logger.log(`application is running on: ${await app.getUrl()}`);
}

bootstrap();
