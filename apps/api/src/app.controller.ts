import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

import { User } from '.prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/create')
  async createMonUser(): Promise<User> {
    return this.appService.createMockUser();
  }

  @Get('/list')
  async getUserList(): Promise<User[]> {
    return this.appService.getUserList();
  }
}
