import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { enhance } from '@zenstackhq/runtime';

@Injectable()
export class PrismaService {
  private readonly _client: PrismaClient;

  constructor() {
    this._client = new PrismaClient();
  }

  get client() {
    return enhance(this._client);
  }
}
