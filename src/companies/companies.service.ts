import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto, adminUserId: string) {
    const company = await this.prisma.company.create({
      data: createCompanyDto,
    });

    // Vinculamos al admin que la creó con su nueva empresa.
    await this.prisma.user.update({
      where: { id: adminUserId },
      data: { companyId: company.id },
    });

    return company;
  }

  async findAll() {
    return this.prisma.company.findMany({
      take: 200,
      include: {
        buses: true,
        users: true,
      },
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        buses: true,
        users: true,
      },
    });
    if (!company) {
      throw new NotFoundException(`Empresa ${id} no encontrada`);
    }
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(id);
    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.company.delete({
      where: { id },
    });
  }
}
