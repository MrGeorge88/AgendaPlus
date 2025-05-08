import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@ApiTags('staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo profesional' })
  @ApiResponse({ status: 201, description: 'Profesional creado correctamente' })
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los profesionales' })
  @ApiResponse({ status: 200, description: 'Lista de profesionales' })
  findAll() {
    return this.staffService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un profesional por ID' })
  @ApiResponse({ status: 200, description: 'Profesional encontrado' })
  @ApiResponse({ status: 404, description: 'Profesional no encontrado' })
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un profesional' })
  @ApiResponse({ status: 200, description: 'Profesional actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Profesional no encontrado' })
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(+id, updateStaffDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un profesional' })
  @ApiResponse({ status: 200, description: 'Profesional eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Profesional no encontrado' })
  remove(@Param('id') id: string) {
    return this.staffService.remove(+id);
  }
}
