import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { AuthGuard } from '../auth/auth.guard'; 

@UseGuards(AuthGuard) 
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  // PUERTA PARA GUARDAR LA RUTA DESDE FLUTTER
  @Post('master')
  async saveNewMasterRoute(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.saveMasterRoute(createRouteDto);
  }

  // NUEVA PUERTA PARA DESCARGAR LA RUTA POR SU NOMBRE
  @Get('master/:name')
  getMasterRouteByName(@Param('name') name: string) {
    return this.routesService.findByName(name);
  }

  // --- CRUD BASICO ---

  @Post()
  create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto);
  }

  @Get()
  findAll() {
    return this.routesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.update(id, updateRouteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routesService.remove(id);
  }
}