import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ description: 'Nombre del servicio' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descripción del servicio' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Precio del servicio' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ description: 'Duración del servicio en minutos' })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  duration: number;

  @ApiProperty({ description: 'Categoría del servicio' })
  @IsOptional()
  @IsString()
  category?: string;
}
