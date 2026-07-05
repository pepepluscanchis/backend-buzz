import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@Injectable()
export class RoutesService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMasterRoute(createRouteDto: CreateRouteDto, companyId: string) {
    const { name, pathCoords } = createRouteDto;

    let route = await this.prisma.route.findFirst({
      where: { name, companyId },
    });

    if (route) {
      route = await this.prisma.route.update({
        where: { id: route.id },
        data: { pathCoords },
      });
    } else {
      route = await this.prisma.route.create({
        data: { name, companyId, pathCoords },
      });
    }

    return route;
  }

  async findByName(name: string) {
    const route = await this.prisma.route.findFirst({ where: { name } });
    if (!route) {
      throw new NotFoundException(`Ruta con nombre ${name} no encontrada`);
    }
    return route;
  }

  create(createRouteDto: CreateRouteDto, companyId: string) {
    const { name, pathCoords, publicLetter, colorHex, badge, isActive } = createRouteDto;
    return this.prisma.route.create({
      data: { name, pathCoords, publicLetter, colorHex, badge, isActive, companyId },
    });
  }

  findAll() {
    return this.prisma.route.findMany({ where: { isActive: true }, take: 200 });
  }

  async findOne(id: string) {
    const route = await this.prisma.route.findUnique({ where: { id } });
    if (!route) {
      throw new NotFoundException(`Ruta ${id} no encontrada`);
    }
    return route;
  }

  async update(id: string, updateRouteDto: UpdateRouteDto, companyId: string) {
    await this.assertOwnedByCompany(id, companyId);
    return this.prisma.route.update({ where: { id }, data: updateRouteDto as any });
  }

  async remove(id: string, companyId: string) {
    await this.assertOwnedByCompany(id, companyId);
    // Soft-delete: se marca inactiva para conservar el historial de buses/paraderos asociados.
    await this.prisma.route.update({ where: { id }, data: { isActive: false } });
    return { message: `Ruta ${id} desactivada` };
  }

  private async assertOwnedByCompany(id: string, companyId: string) {
    const route = await this.findOne(id);
    if (route.companyId !== companyId) {
      throw new ForbiddenException('Esa ruta pertenece a otra empresa.');
    }
    return route;
  }
}
