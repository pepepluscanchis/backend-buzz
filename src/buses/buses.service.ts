import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBusDto: CreateBusDto, companyId: string) {
    return this.prisma.bus.create({
      data: { ...createBusDto, companyId },
    });
  }

  async findAll() {
    // Trae todos los buses activos, incluyendo la ruta que están corriendo
    return this.prisma.bus.findMany({
      where: { isActive: true },
      include: { route: true },
      take: 200,
    });
  }

  async findOne(id: string) {
    const bus = await this.prisma.bus.findUnique({
      where: { id },
      include: { route: true },
    });
    if (!bus) {
      throw new NotFoundException(`Bus ${id} no encontrado`);
    }
    return bus;
  }

  async getLastLocation(id: string) {
    const bus = await this.findOne(id);
    return {
      busId: bus.id,
      lat: bus.lastLat,
      lng: bus.lastLng,
      updatedAt: bus.lastLocationAt,
    };
  }

  async update(id: string, updateBusDto: UpdateBusDto, companyId: string) {
    await this.assertOwnedByCompany(id, companyId);
    return this.prisma.bus.update({
      where: { id },
      data: updateBusDto,
    });
  }

  async remove(id: string, companyId: string) {
    await this.assertOwnedByCompany(id, companyId);
    // Soft-delete: se marca inactivo para no perder historial ni romper relaciones.
    return this.prisma.bus.update({ where: { id }, data: { isActive: false } });
  }

  private async assertOwnedByCompany(id: string, companyId: string) {
    const bus = await this.findOne(id);
    if (bus.companyId !== companyId) {
      throw new ForbiddenException('Ese bus pertenece a otra empresa.');
    }
    return bus;
  }
}
