import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export enum UserRole {
  PASSENGER = 'PASSENGER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
}

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  // Opcional: Porque el pasajero que entra con Google no tendrá clave
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  // Actualizado: Usamos el Enum oficial en lugar del string con @IsIn
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(AuthProvider)
  authProvider?: AuthProvider;

  @IsString()
  @IsOptional()
  vehiclePlate?: string;

  // Mantenemos tu campo para la futura relación SaaS
  @IsString()
  @IsOptional()
  companyId?: string;
}