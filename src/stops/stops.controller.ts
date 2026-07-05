import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { StopsService } from './stops.service';
import { CreateStopDto } from './dto/create-stop.dto';
import { UpdateStopDto } from './dto/update-stop.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('stops')
export class StopsController {
  constructor(private readonly stopsService: StopsService) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() createStopDto: CreateStopDto, @Request() req) {
    return this.stopsService.create(createStopDto, req.user.companyId);
  }

  @Get()
  findAll() {
    return this.stopsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stopsService.findOne(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStopDto: UpdateStopDto, @Request() req) {
    return this.stopsService.update(id, updateStopDto, req.user.companyId);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.stopsService.remove(id, req.user.companyId);
  }
}
