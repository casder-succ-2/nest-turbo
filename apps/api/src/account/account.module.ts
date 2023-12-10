import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AccountController],
  providers: [AccountService, AtStrategy, RtStrategy],
})
export class AccountModule {}
