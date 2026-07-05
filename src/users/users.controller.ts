import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard'; 

@Controller('users') // Le quitamos el candado principal a todo el modulo
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // Esta ruta queda libre para que te puedas registrar por primera vez
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard) // Candado individual activado
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard) // Candado individual activado
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard) // Candado individual activado
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard) // Candado individual activado
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}