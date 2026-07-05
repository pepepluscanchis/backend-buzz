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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(AuthGuard, RolesGuard) // Todo el controlador exige estar logueado
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  // Un ADMIN sin empresa aún puede crear la suya (alta de una nueva empresa de transportes).
  @Roles('ADMIN')
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @Request() req) {
    if (req.user.companyId) {
      throw new ForbiddenException('Tu usuario ya pertenece a una empresa.');
    }
    return this.companiesService.create(createCompanyDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @Request() req) {
    this.assertOwnCompany(id, req);
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    this.assertOwnCompany(id, req);
    return this.companiesService.remove(id);
  }

  private assertOwnCompany(id: string, req: any) {
    if (req.user.companyId !== id) {
      throw new ForbiddenException('No puedes modificar una empresa que no es la tuya.');
    }
  }
}
