import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  // PUERTA PARA GUARDAR EL TRAZO GRABADO DESDE FLUTTER (chofer en campo)
  @Roles('DRIVER', 'ADMIN')
  @Post('master')
  async saveNewMasterRoute(@Body() createRouteDto: CreateRouteDto, @Request() req) {
    // La empresa siempre es la del usuario autenticado, nunca la que mande el body.
    return this.routesService.saveMasterRoute(createRouteDto, req.user.companyId);
  }

  // Descargar el trazo maestro por nombre
  @Get('master/:name')
  getMasterRouteByName(@Param('name') name: string) {
    return this.routesService.findByName(name);
  }

  // --- CRUD BASICO ---

  @Roles('ADMIN')
  @Post()
  create(@Body() createRouteDto: CreateRouteDto, @Request() req) {
    return this.routesService.create(createRouteDto, req.user.companyId);
  }

  @Get()
  findAll() {
    return this.routesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto, @Request() req) {
    delete (updateRouteDto as any).companyId;
    return this.routesService.update(id, updateRouteDto, req.user.companyId);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.routesService.remove(id, req.user.companyId);
  }
}
