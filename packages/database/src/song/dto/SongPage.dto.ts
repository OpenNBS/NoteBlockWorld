import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

import { SongPreviewDto } from './SongPreview.dto';

export class SongPageDto {
    @IsNotEmpty()
    @IsArray()
    @ValidateNested()
    content: Array<SongPreviewDto>;

    @IsNotEmpty()
    @IsNumber({
        allowNaN        : false,
        allowInfinity   : false,
        maxDecimalPlaces: 0
    })
    page: number;

    @IsNotEmpty()
    @IsNumber({
        allowNaN        : false,
        allowInfinity   : false,
        maxDecimalPlaces: 0
    })
    limit: number;

    @IsNotEmpty()
    @IsNumber({
        allowNaN        : false,
        allowInfinity   : false,
        maxDecimalPlaces: 0
    })
    total: number;
}
