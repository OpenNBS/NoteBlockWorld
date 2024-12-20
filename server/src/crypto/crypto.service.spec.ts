import { Test, TestingModule } from '@nestjs/testing';

import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'SALTS_ROUNDS',
          useValue: 10,
        },
        CryptoService,
      ],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should hash a password', () => {
      const password = 'mySecurePassword';
      const hashedPassword = service.hashPassword(password);

      expect(hashedPassword).toMatch(/^[a-f0-9]{32}:[a-f0-9]{128}$/);
    });
  });

  describe('compareHashes', () => {
    it('should return true for matching passwords', () => {
      const password = 'mySecurePassword';
      const hashedPassword = service.hashPassword(password);

      const isMatch = service.compareHashes(password, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching passwords', () => {
      const password = 'mySecurePassword';
      const hashedPassword = service.hashPassword(password);

      const isMatch = service.compareHashes('wrongPassword', hashedPassword);
      expect(isMatch).toBe(false);
    });
  });
});
