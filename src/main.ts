import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const prefixGlobal = "api/v1";

    app.enableCors();
    app.setGlobalPrefix(prefixGlobal);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    const configService = app.get(ConfigService);
    const port = configService.get<number>("PORT") ?? 3000;

    await app.listen(port);
    console.log(`🚀 Servidor ejecutándose en http://localhost:${port}/${prefixGlobal}`);
}

bootstrap();
