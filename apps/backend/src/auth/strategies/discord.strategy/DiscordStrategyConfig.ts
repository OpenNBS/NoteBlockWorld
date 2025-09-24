import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString
} from 'class-validator';
import {
    StrategyOptions as OAuth2StrategyOptions,
    StrategyOptionsWithRequest as OAuth2StrategyOptionsWithRequest
} from 'passport-oauth2';

import type { ScopeType } from './types';

type MergedOAuth2StrategyOptions =
  | OAuth2StrategyOptions
  | OAuth2StrategyOptionsWithRequest;

type DiscordStrategyOptions = Pick<
    MergedOAuth2StrategyOptions,
  'clientID' | 'clientSecret' | 'scope'
>;

export class DiscordStrategyConfig implements DiscordStrategyOptions {
    // The client ID assigned by Discord.
    @IsString()
    clientID: string;

    // The client secret assigned by Discord.
    @IsString()
    clientSecret: string;

    // The URL to which Discord will redirect the user after granting authorization.
    @IsString()
    callbackUrl: string;

    // An array of permission scopes to request.
    @IsArray()
    @IsString({ each: true })
    scope: ScopeType;

    // The delay in milliseconds between requests for the same scope.
    @IsOptional()
    @IsNumber()
    scopeDelay?: number;

    // Whether to fetch data for the specified scope.
    @IsOptional()
    @IsBoolean()
    fetchScope?: boolean;

    @IsEnum(['none', 'consent'])
    prompt: 'consent' | 'none';

    // The separator for the scope values.
    @IsOptional()
    @IsString()
    scopeSeparator?: string;
}
