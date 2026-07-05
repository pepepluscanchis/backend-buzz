import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StopsService } from './stops.service';
import { CreateStopDto } from './dto/create-stop.dto';
import { UpdateStopDto } from './dto/update-stop.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard) // Bóveda protegida
@Controller('stops')
export class StopsController {
  constructor(private readonly stopsService: StopsService) {}

  @Post()
  create(@Body() createStopDto: CreateStopDto) {
    return this.stopsService.create(createStopDto);
  }

  @Get()
  findAll() {
    return this.stopsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stopsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStopDto: UpdateStopDto) {
    return this.stopsService.update(id, updateStopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stopsService.remove(id);
  }
}