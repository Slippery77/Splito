import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './dist/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './module/users/users.module';
import { RegisterModule } from './module/register/register.module';
import { AuthModule } from './module/auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    UserModule,
    RegisterModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
