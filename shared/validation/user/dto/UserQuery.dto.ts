import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';

import { PageQueryDTO } from '@shared/validation/common/dto/PageQuery.dto';

export class UserQuery extends PartialType(PageQueryDTO) {
  @IsBoolean()
  @IsOptional()
  me?: boolean;
}
