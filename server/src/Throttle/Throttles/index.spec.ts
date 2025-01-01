import { Throttle } from '@nestjs/throttler';

import { ThrottleConfigs, UseThrottle, configs } from './index';

jest.mock('@nestjs/throttler', () => ({
  Throttle: jest.fn(),
}));

describe('UseThrottle', () => {
  it('should return a Throttle instance with the correct config', () => {
    const name: ThrottleConfigs = 'medium';
    const config = configs[name];

    UseThrottle(name);

    expect(Throttle).toHaveBeenCalledWith({
      default: config,
    });
  });
});
