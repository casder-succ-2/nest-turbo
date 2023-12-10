import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'common/pipes';
import { RtGuard } from 'common/guards';
import { GetCurrentUser, Public } from 'common/decorators';

import { AccountService } from './account.service';

import { accountDto, schema } from './schema';

@Controller('/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Public()
  @Post('/sign-up')
  @UsePipes(new ZodValidationPipe(schema))
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: accountDto) {
    return await this.accountService.signUp(dto);
  }

  @Public()
  @Post('/sign-in')
  @UsePipes(new ZodValidationPipe(schema))
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: accountDto) {
    return await this.accountService.signIn(dto);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logOut(@GetCurrentUser('userId') userId: number) {
    return await this.accountService.logOut(userId);
  }

  @Public()
  @UseGuards(new RtGuard())
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUser('userId') userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return await this.accountService.refreshTokens(userId, refreshToken);
  }
}
