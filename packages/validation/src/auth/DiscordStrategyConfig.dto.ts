import { z } from 'zod';

export const discordStrategyConfigSchema = z.object({
  clientID: z.string(),
  clientSecret: z.string(),
  callbackUrl: z.string(),
  scope: z.array(z.string()),
  scopeDelay: z.number().optional(),
  fetchScope: z.boolean().optional(),
  prompt: z.enum(['none', 'consent']),
  scopeSeparator: z.string().optional(),
});

export type DiscordStrategyConfig = z.infer<typeof discordStrategyConfigSchema>;
