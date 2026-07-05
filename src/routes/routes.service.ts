import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@Injectable()
export class RoutesService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMasterRoute(createRouteDto: CreateRouteDto) {
    const { name, companyId, pathCoords } = createRouteDto;

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

  create(createRouteDto: CreateRouteDto) {
    return this.prisma.route.create({ data: createRouteDto as any });
  }

  findAll() {
    return this.prisma.route.findMany();
  }

  findOne(id: string) {
    return this.prisma.route.findUnique({ where: { id } });
  }

  async update(id: string, updateRouteDto: UpdateRouteDto) {
    return this.prisma.route.update({ where: { id }, data: updateRouteDto as any });
  }

  async remove(id: string) {
    await this.prisma.route.delete({ where: { id } });
    return { message: `Ruta ${id} eliminada` };
  }
}
