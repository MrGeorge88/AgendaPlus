import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../shared/supabase/supabase.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll() {
    // Por ahora, devolvemos datos de ejemplo
    return [
      { id: 1, name: "Corte de cabello", price: 25, duration: 30, category: "Peluquería" },
      { id: 2, name: "Manicura", price: 20, duration: 45, category: "Uñas" },
      { id: 3, name: "Pedicura", price: 25, duration: 45, category: "Uñas" },
      { id: 4, name: "Tinte", price: 50, duration: 90, category: "Peluquería" },
    ];
  }

  async findOne(id: number) {
    // Implementación futura con Supabase
    return { id, name: "Corte de cabello", price: 25, duration: 30, category: "Peluquería" };
  }

  async create(createServiceDto: CreateServiceDto) {
    // Implementación futura con Supabase
    return {
      id: 5,
      ...createServiceDto,
    };
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    // Implementación futura con Supabase
    return {
      id,
      ...updateServiceDto,
    };
  }

  async remove(id: number) {
    // Implementación futura con Supabase
    return { id };
  }
}
