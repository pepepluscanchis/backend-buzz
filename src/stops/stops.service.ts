import { Injectable } from '@nestjs/common';
import { CreateStopDto } from './dto/create-stop.dto';
import { UpdateStopDto } from './dto/update-stop.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StopsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createStopDto: CreateStopDto) {
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
    return this.prisma.stop.findMany();
  }

  findOne(id: string) {
    return this.prisma.stop.findUnique({
      where: { id },
    });
  }

  update(id: string, updateStopDto: UpdateStopDto) {
    return this.prisma.stop.update({
      where: { id },
      data: updateStopDto,
    });
  }

  remove(id: string) {
    return this.prisma.stop.delete({
      where: { id },
    });
  }
}