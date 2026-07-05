import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Solo un ADMIN puede dar de alta choferes/otros admins de su propia empresa.
  // El auto-registro de pasajeros va por POST /auth/register.
  @Roles('ADMIN')
  @Post()
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.usersService.create(createUserDto, req.user.companyId);
  }

  @Roles('ADMIN')
  @Get()
  findAll(@Request() req) {
    return this.usersService.findAll(req.user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    this.assertSelfOrAdmin(id, req);
    return this.usersService.findOne(id, req.user.role === 'ADMIN' ? req.user.companyId : undefined);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    this.assertSelfOrAdmin(id, req);

    // Un usuario editando su propio perfil no puede auto-ascenderse ni cambiarse de empresa.
    if (req.user.role !== 'ADMIN') {
      delete (updateUserDto as any).role;
      delete (updateUserDto as any).companyId;
    }

    return this.usersService.update(id, updateUserDto, req.user.role === 'ADMIN' ? req.user.companyId : undefined);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.usersService.remove(id, req.user.companyId);
  }

  private assertSelfOrAdmin(id: string, req: any) {
    if (req.user.role !== 'ADMIN' && req.user.id !== id) {
      throw new ForbiddenException('No puedes acceder a datos de otro usuario.');
    }
  }
}
