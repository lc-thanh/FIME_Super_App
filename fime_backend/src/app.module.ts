import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@/modules/user/user.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/modules/auth/passport/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TaskModule } from './modules/task/task.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { PositionModule } from './modules/position/position.module';
import { TeamModule } from './modules/team/team.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GenModule } from './modules/gen/gen.module';
import { LatestPublicationModule } from './modules/latest-publication/latest-publication.module';
import { NewestProductModule } from './modules/newest-product/newest-product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAILDEV_HOST'),
          port: configService.get<number>('MAILDEV_PORT'),
          secure: true,
          // ignoreTLS: true,
          // secure: false,
          auth: {
            user: configService.get<string>('MAILDEV_INCOMING_USER'),
            pass: configService.get<string>('MAILDEV_INCOMING_PASS'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        preview: true,
        template: {
          dir: process.cwd() + 'mail/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'), // Đường dẫn đến thư mục public
      serveRoot: '/public', // URL sẽ được truy cập tại /public
    }),
    TaskModule,
    WorkspaceModule,
    PositionModule,
    TeamModule,
    GenModule,
    LatestPublicationModule,
    NewestProductModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
