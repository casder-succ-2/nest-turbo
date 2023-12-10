import { Injectable } from '@nestjs/common';
import { User } from '.prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async usersList(): Promise<User[]> {
    return await this.prisma.user.findMany({});
  }

  async usersById(id: number): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
