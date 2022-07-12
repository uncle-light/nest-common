import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger/dist';

export function setupSwagger(app: INestApplication, port?: number): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle(process.env.APP_TITLE)
    .setDescription(process.env.APP_TITLE + '接口文档')
    .setTermsOfService('https://docs.nestjs.cn/8/introduction')
    .addBearerAuth()
    .addServer(process.env.APP_URL)
    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true, // 持久化授权
    },
    customSiteTitle: 'My API Docs',
  };
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  process.env.NODE_ENV === 'development' &&
    SwaggerModule.setup(`/doc`, app, document, customOptions);
  console.log(`${process.env.APP_URL}/doc`);
}
