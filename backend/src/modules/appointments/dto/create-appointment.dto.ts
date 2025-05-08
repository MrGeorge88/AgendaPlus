import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Título de la cita' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Fecha y hora de inicio de la cita' })
  @IsNotEmpty()
  @IsDateString()
  start: string;

  @ApiProperty({ description: 'Fecha y hora de fin de la cita' })
  @IsNotEmpty()
  @IsDateString()
  end: string;

  @ApiProperty({ description: 'ID del profesional asignado' })
  @IsNotEmpty()
  @IsNumber()
  resourceId: number;

  @ApiProperty({ description: 'Color de fondo para la cita en el calendario' })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiProperty({ description: 'Color del borde para la cita en el calendario' })
  @IsOptional()
  @IsString()
  borderColor?: string;

  @ApiProperty({ 
    description: 'Propiedades extendidas de la cita',
    example: {
      client: 'Juan Pérez',
      service: 'Corte de cabello',
      price: 25,
      status: 'confirmed'
    }
  })
  @IsOptional()
  @IsObject()
  extendedProps?: {
    client: string;
    service: string;
    price: number;
    status: string;
  };
}
