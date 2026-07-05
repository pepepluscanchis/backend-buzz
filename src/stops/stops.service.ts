import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStopDto } from './dto/create-stop.dto';
import { UpdateStopDto } from './dto/update-stop.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StopsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStopDto: CreateStopDto, companyId: string) {
    await this.assertRouteOwnedByCompany(createStopDto.routeId, companyId);

    return this.prisma.stop.create({
      data: {
        name: createStopDto.name,
        latitude: createStopDto.latitude,
        longitude: createStopDto.longitude,
        routeId: createStopDto.routeId,
      },
    });
  }

  findAll() {
    return this.prisma.stop.findMany({ take: 500 });
  }

  async findOne(id: string) {
    const stop = await this.prisma.stop.findUnique({ where: { id } });
    if (!stop) {
      throw new NotFoundException(`Paradero ${id} no encontrado`);
    }
    return stop;
  }

  async update(id: string, updateStopDto: UpdateStopDto, companyId: string) {
    const stop = await this.findOne(id);
    await this.assertRouteOwnedByCompany(updateStopDto.routeId ?? stop.routeId, companyId);

    return this.prisma.stop.update({
      where: { id },
      data: updateStopDto,
    });
  }

  async remove(id: string, companyId: string) {
    const stop = await this.findOne(id);
    await this.assertRouteOwnedByCompany(stop.routeId, companyId);

    return this.prisma.stop.delete({
      where: { id },
    });
  }

  private async assertRouteOwnedByCompany(routeId: string, companyId: string) {
    const route = await this.prisma.route.findUnique({ where: { id: routeId } });
    if (!route) {
      throw new NotFoundException(`Ruta ${routeId} no encontrada`);
    }
    if (route.companyId !== companyId) {
      throw new ForbiddenException('Esa ruta pertenece a otra empresa.');
    }
  }
}
