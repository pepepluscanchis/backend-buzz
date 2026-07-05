import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

// Nunca devolvemos el hash de la contraseña al cliente.
const SAFE_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  authProvider: true,
  vehiclePlate: true,
  companyId: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, adminCompanyId: string | null) {
    const data: any = { ...createUserDto, companyId: adminCompanyId };

    if (createUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(createUserDto.password, salt);
    }

    return this.prisma.user.create({ data, select: SAFE_SELECT });
  }

  findAll(companyId: string | null) {
    return this.prisma.user.findMany({
      where: { companyId: companyId ?? undefined },
      select: SAFE_SELECT,
      take: 200,
    });
  }

  async findOne(id: string, companyId?: string | null) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: SAFE_SELECT });
    if (!user) {
      throw new NotFoundException(`Usuario ${id} no encontrado`);
    }
    if (companyId && user.companyId !== companyId) {
      throw new ForbiddenException('Ese usuario pertenece a otra empresa.');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, companyId?: string | null) {
    await this.findOne(id, companyId);

    const data: any = { ...updateUserDto };
    if ((updateUserDto as any).password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash((updateUserDto as any).password, salt);
    }

    return this.prisma.user.update({ where: { id }, data, select: SAFE_SELECT });
  }

  async remove(id: string, companyId: string | null) {
    await this.findOne(id, companyId);
    return this.prisma.user.delete({ where: { id }, select: SAFE_SELECT });
  }
}
