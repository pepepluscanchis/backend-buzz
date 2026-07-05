import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  companyId!: string;

  @IsOptional()
  pathCoords?: any;

  // --- CAMPOS VISUALES OPCIONALES ---
  @IsOptional()
  @IsString()
  publicLetter?: string;

  @IsOptional()
  @IsString()
  colorHex?: string;

  @IsOptional()
  @IsString()
  badge?: string;

  // --- ESTADO DE LA RUTA ---
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}