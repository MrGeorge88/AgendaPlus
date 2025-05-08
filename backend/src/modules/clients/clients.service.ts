import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../shared/supabase/supabase.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll() {
    // Por ahora, devolvemos datos de ejemplo
    return [
      { id: 1, name: "Juan Pérez", email: "juan@example.com", phone: "123-456-7890" },
      { id: 2, name: "María López", email: "maria@example.com", phone: "123-456-7891" },
      { id: 3, name: "Carlos Gómez", email: "carlos@example.com", phone: "123-456-7892" },
    ];
  }

  async findOne(id: number) {
    // Implementación futura con Supabase
    return { id, name: "Juan Pérez", email: "juan@example.com", phone: "123-456-7890" };
  }

  async create(createClientDto: CreateClientDto) {
    // Implementación futura con Supabase
    return {
      id: 4,
      ...createClientDto,
    };
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    // Implementación futura con Supabase
    return {
      id,
      ...updateClientDto,
    };
  }

  async remove(id: number) {
    // Implementación futura con Supabase
    return { id };
  }
}
