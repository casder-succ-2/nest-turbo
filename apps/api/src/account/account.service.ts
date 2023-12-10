import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';

import { compareTextWithHash, getHash } from 'utils/security.utils';

import { Tokens } from './types';
import { accountDto } from './schema';

@Injectable()
export class AccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signUp(data: accountDto): Promise<Tokens> {
    const { email, password } = data;

    const hash = await getHash(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hash,
      },
    });

    const tokens = await this.getTokens(user.id, user.email);

    await this.updateRt(user.id, tokens.refresh_token);

    return tokens;
  }

  async signIn(data: accountDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new HttpException(
        'The email or password you have entered is invalid',
        HttpStatus.FORBIDDEN,
      );
    }

    const isPasswordMatch = await compareTextWithHash(
      data.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new HttpException(
        'The email or password you have entered is invalid',
        HttpStatus.FORBIDDEN,
      );
    }

    const tokens = await this.getTokens(user.id, user.email);

    await this.updateRt(user.id, tokens.refresh_token);

    return tokens;
  }

  async logOut(userId: number) {
    return await this.prisma.user.updateMany({
      where: { id: userId, refreshToken: { not: null } },
      data: { refreshToken: null },
    });
  }

  async refreshTokens(userId: number, rt: string) {
    const existsUser = await this.prisma.user.findUnique({
      where: { id: userId, refreshToken: rt },
    });

    if (!existsUser) {
      throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
    }

    const tokens = await this.getTokens(existsUser.id, existsUser.email);

    await this.updateRt(existsUser.id, tokens.refresh_token);

    return tokens;
  }

  async getTokens(userId: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
          email,
        },
        {
          secret: this.config.get<string>('AT_SECRET'),
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          userId,
          email,
        },
        {
          secret: this.config.get<string>('RT_SECRET'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRt(userId: number, rt: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
      },
      data: {
        refreshToken: rt,
      },
    });

    return;
  }
}
