import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateNewestProductDto } from './create-newest-product.dto';
import { Transform } from 'class-transformer';

export class UpdateNewestProductDto extends CreateNewestProductDto {
  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => value === 'true')
  isImageChanged: boolean;
}
