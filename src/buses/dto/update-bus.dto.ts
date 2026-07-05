import { PartialType } from '@nestjs/mapped-types';
import { CreateBusDto } from './create-bus.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBusDto extends PartialType(CreateBusDto) {
  @IsString()
  @IsOptional()
  routeId?: string; // Para poder pasarle el ID de la Letra V
}