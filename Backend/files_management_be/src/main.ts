import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppConfigService } from "./config/app_config.service";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalInterceptors(new ResponseInterceptor());
    // app.useGlobalFilters(new HttpExceptionFilter());

    app.setGlobalPrefix("api/v1.0");
    app.use(cookieParser());
    app.enableCors({
        origin: "http://localhost:3000",
        credentials: true,
    });

    const appConfig = app.get(AppConfigService);

    if (appConfig.ENABLE_SWAGGER) {
        const swaggerConfig = new DocumentBuilder()
            .setTitle("Files Management APIs")
            .setDescription("APIs Document for Files Management App")
            .setVersion("1.0")
            .build();
        const document = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup('api/v1.0/docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true
            }
        })
    }

    console.log(appConfig.APP_PORT);
    console.log(appConfig.NODE_ENV);

    app.listen(appConfig.APP_PORT ?? 3000);
}

bootstrap()