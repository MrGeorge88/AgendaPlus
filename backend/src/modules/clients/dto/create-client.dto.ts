import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ description: 'Nombre completo del cliente' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Correo electrónico del cliente' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Número de teléfono del cliente' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Notas adicionales sobre el cliente' })
  @IsOptional()
  @IsString()
  notes?: string;
}
