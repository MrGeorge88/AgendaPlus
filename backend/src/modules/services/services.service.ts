import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../shared/supabase/supabase.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(userId?: string) {
    try {
      const supabase = this.supabaseService.getClient();
      let query = supabase.from('services').select('*');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Error al obtener servicios: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error en findAll services:', error);
      throw error;
    }
  }

  async findOne(id: string, userId?: string) {
    try {
      const supabase = this.supabaseService.getClient();
      let query = supabase.from('services').select('*').eq('id', id);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.single();

      if (error) {
        throw new Error(`Error al obtener servicio: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error en findOne service:', error);
      throw error;
    }
  }

  async create(createServiceDto: CreateServiceDto, userId: string) {
    try {
      const supabase = this.supabaseService.getClient();

      const serviceData = {
        ...createServiceDto,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('services')
        .insert(serviceData)
        .select()
        .single();

      if (error) {
        throw new Error(`Error al crear servicio: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error en create service:', error);
      throw error;
    }
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, userId?: string) {
    try {
      const supabase = this.supabaseService.getClient();

      const updateData = {
        ...updateServiceDto,
        updated_at: new Date().toISOString(),
      };

      let query = supabase.from('services').update(updateData).eq('id', id);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.select().single();

      if (error) {
        throw new Error(`Error al actualizar servicio: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error en update service:', error);
      throw error;
    }
  }

  async remove(id: string, userId?: string) {
    try {
      const supabase = this.supabaseService.getClient();

      let query = supabase.from('services').delete().eq('id', id);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { error } = await query;

      if (error) {
        throw new Error(`Error al eliminar servicio: ${error.message}`);
      }

      return { success: true, id };
    } catch (error) {
      console.error('Error en remove service:', error);
      throw error;
    }
  }
}
