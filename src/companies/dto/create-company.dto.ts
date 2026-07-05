import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsString()
  @MinLength(11)
  @MaxLength(11)
  ruc!: string;
}