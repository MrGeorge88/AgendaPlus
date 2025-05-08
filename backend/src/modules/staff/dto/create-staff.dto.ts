import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({ description: 'Nombre del profesional' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Color asignado al profesional para el calendario' })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({ description: 'URL del avatar del profesional' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: 'Especialidad del profesional' })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiProperty({ description: 'Correo electrónico del profesional' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Número de teléfono del profesional' })
  @IsOptional()
  @IsString()
  phone?: string;
}
