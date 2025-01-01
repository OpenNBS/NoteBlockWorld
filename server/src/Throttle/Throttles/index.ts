import {
  Resolvable,
  Throttle,
  ThrottlerGenerateKeyFunction,
  ThrottlerGetTrackerFunction,
} from '@nestjs/throttler';
interface ThrottlerMethodOrControllerOptions {
  limit?: Resolvable<number>;
  ttl?: Resolvable<number>;
  blockDuration?: Resolvable<number>;
  getTracker?: ThrottlerGetTrackerFunction;
  generateKey?: ThrottlerGenerateKeyFunction;
}

export type ThrottleConfigs =
  | 'short'
  | 'medium'
  | 'long'
  | 'very-long'
  | 'super-long';

export const configs: {
  [key in ThrottleConfigs]: ThrottlerMethodOrControllerOptions;
} = {
  short: {
    ttl: 1000, // 1 second
    limit: 5,
  },
  medium: {
    ttl: 60 * 1000, // 1 minute
    limit: 100,
  },
  long: {
    ttl: 60 * 60 * 100, // 1 hour
    limit: 1000,
  },
  // one every 15 minutes
  'very-long': {
    ttl: 15 * 60 * 1000,
    limit: 1,
  },
  // one every 1 hour
  'super-long': {
    ttl: 60 * 60 * 1000,
    limit: 1,
  },
};

/**
 * Applies a throttle configuration based on the provided name.
 *
 * @param {ThrottleConfigs} name - The name of the throttle configuration to use.
 * @returns {Throttle} - The throttle instance configured with the specified settings.
 * @example
 * ```ts
 * @UseThrottle('super-long')
 * @Post('login/magic-link')
 * public async magicLinkLogin(@Req() req: Request, @Res() res: Response) {
 *  return this.magicLinkEmailStrategy.send(req, res);
 * }
 */
export const UseThrottle = (name: ThrottleConfigs) => {
  const config = configs[name];
  return Throttle({
    default: config,
  });
};
