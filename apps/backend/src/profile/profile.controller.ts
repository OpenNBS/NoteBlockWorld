import { Body, Controller, Get, Inject, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { UserDocument } from '@nbw/database';
import type { PublicProfileDto } from '@nbw/validation';
import { GetRequestToken, validateUser } from '@server/lib/GetRequestUser';
import { PatchProfileBodyDto, ProfileUsernameParamDto } from '@server/zod-dto';

import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(
    @Inject(ProfileService)
    private readonly profileService: ProfileService,
  ) {}

  @Patch()
  @ApiTags('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update the authenticated user profile (Profile document)',
  })
  public async patchProfile(
    @GetRequestToken() user: UserDocument | null,
    @Body() body: PatchProfileBodyDto,
  ): Promise<PublicProfileDto> {
    user = validateUser(user);
    return await this.profileService.patchProfile(user, body);
  }

  @Get('u/:username')
  @ApiTags('profile')
  @ApiOperation({
    summary:
      'Get public profile by normalized username (path matches User.username)',
  })
  public async getPublicProfile(
    @Param() params: ProfileUsernameParamDto,
  ): Promise<PublicProfileDto> {
    return await this.profileService.getMergedPublicProfileByUsername(
      params.username,
    );
  }
}
