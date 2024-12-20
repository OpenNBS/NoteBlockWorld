import { pbkdf2Sync, randomBytes } from 'crypto';

import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CryptoService {
  private readonly logger = new Logger(CryptoService.name);
  constructor(
    @Inject('SALTS_ROUNDS')
    private readonly SALTS_ROUNDS: number,
  ) {}

  hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');

    const hash = pbkdf2Sync(
      password,
      salt,
      this.SALTS_ROUNDS,
      64,
      'sha512',
    ).toString('hex');

    return `${salt}:${hash}`;
  }

  compareHashes(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':');

    const hashedPassword = pbkdf2Sync(
      password,
      salt,
      this.SALTS_ROUNDS,
      64,
      'sha512',
    ).toString('hex');

    return hash === hashedPassword;
  }
}
