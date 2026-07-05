import { Injectable } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { PrismaService } from '../prisma/prisma.service'; // Asegúrate de que la ruta sea la correcta en tu proyecto

@Injectable()
export class BusesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBusDto: CreateBusDto) {
    // Registra un nuevo micro amarrado a su empresa
    return this.prisma.bus.create({
      data: createBusDto,
    });
  }

  async findAll() {
    // Trae todos los buses de Trujillo incluyendo la info de la ruta que están corriendo
    return this.prisma.bus.findMany({
      include: {
        route: true, 
      },
    });
  }

  async findOne(id: string) {
    // Busca un micro específico por su ID e incluye su ruta
    return this.prisma.bus.findUnique({
      where: { id },
      include: { route: true }, 
    });
  }

  async update(id: string, updateBusDto: UpdateBusDto) {
    // Aquí es donde se hace la magia de asignarle o cambiarle la ruta al micro
    return this.prisma.bus.update({
      where: { id },
      data: updateBusDto,
    });
  }

  async remove(id: string) {
    // Elimina el micro del sistema
    return this.prisma.bus.delete({
      where: { id },
    });
  }
}