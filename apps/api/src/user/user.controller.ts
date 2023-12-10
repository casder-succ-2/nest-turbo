import { Controller, Get, Param } from '@nestjs/common';

import { UserService } from './user.service';

import { User } from '.prisma/client';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/list')
  async getUsersList(): Promise<User[]> {
    return await this.userService.usersList();
  }

  @Get('/:id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return await this.userService.usersById(+id);
  }
}
