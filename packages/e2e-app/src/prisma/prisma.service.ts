import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService {
  private readonly _client: PrismaClient;

  constructor() {
    this._client = new PrismaClient();
  }

  get client() {
    return this._client.$extends({});
  }
}
