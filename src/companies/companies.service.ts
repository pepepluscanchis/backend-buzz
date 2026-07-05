import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: createCompanyDto,
    });
  }

  // Trae todas las empresas con sus buses y usuarios vinculados
  async findAll() {
    return this.prisma.company.findMany({
      include: {
        buses: true,
        users: true,
      },
    });
  }

  // Trae una empresa específica con todo su detalle
  async findOne(id: string) {
    return this.prisma.company.findUnique({
      where: { id },
      include: {
        buses: true,
        users: true,
      },
    });
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

  async remove(id: string) {
    return this.prisma.company.delete({
      where: { id },
    });
  }
}