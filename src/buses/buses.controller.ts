import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BusesService } from './buses.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(AuthGuard, RolesGuard) // Todo el controlador exige estar logueado
@Controller('buses')
export class BusesController {
  constructor(private readonly busesService: BusesService) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() createBusDto: CreateBusDto, @Request() req) {
    // La empresa del bus siempre es la del admin autenticado, nunca la que mande el cliente.
    return this.busesService.create(createBusDto, req.user.companyId);
  }

  @Get()
  findAll() {
    return this.busesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.busesService.findOne(id);
  }

  @Get(':id/location')
  getLastLocation(@Param('id') id: string) {
    return this.busesService.getLastLocation(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBusDto: UpdateBusDto, @Request() req) {
    // No se permite reasignar un bus a otra empresa desde este endpoint.
    delete (updateBusDto as any).companyId;
    return this.busesService.update(id, updateBusDto, req.user.companyId);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.busesService.remove(id, req.user.companyId);
  }
}
