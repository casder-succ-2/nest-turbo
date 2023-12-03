import { Injectable } from '@nestjs/common';
import { prisma } from 'db';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async createMockUser() {
    return await prisma.user.create({
      data: {
        name: 'Dav',
        email: 'test@gmail.com',
      },
    });
  }

  async getUserList() {
    return await prisma.user.findMany({});
  }
}
