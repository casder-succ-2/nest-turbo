import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AtGuard } from 'common/guards';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    UserModule,
    AccountModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
