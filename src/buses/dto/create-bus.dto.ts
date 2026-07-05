import { IsString, IsInt, IsPositive, MinLength, IsOptional } from 'class-validator';

export class CreateBusDto {
  @IsString()
  @MinLength(6)
  plate!: string;

  @IsString()
  model!: string;

  @IsInt()
  @IsPositive()
  capacity!: number;

  @IsString()
  @IsOptional()
  unitNumber?: string;

  @IsString()
  companyId!: string;
}