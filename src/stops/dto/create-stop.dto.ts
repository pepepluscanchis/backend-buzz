import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateStopDto {
  @IsString()
  @IsNotEmpty()
  name!: string; // Ej: "Paradero Óvalo Papal"

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsString()
  @IsNotEmpty()
  routeId!: string; // El ID de la ruta a la que pertenece (el que te acaba de salir en Postman)
}