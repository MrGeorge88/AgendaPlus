import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../shared/supabase/supabase.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async login(loginDto: LoginDto) {
    try {
      // En una implementación real, esto sería una llamada a Supabase
      // const { data, error } = await this.supabaseService.getClient().auth.signInWithPassword({
      //   email: loginDto.email,
      //   password: loginDto.password,
      // });
      
      // if (error) throw new UnauthorizedException(error.message);
      
      // return {
      //   user: data.user,
      //   session: data.session,
      // };

      // Por ahora, simulamos el inicio de sesión
      return {
        user: {
          id: '1',
          email: loginDto.email,
          name: 'Usuario Demo',
          avatar_url: 'https://github.com/shadcn.png',
        },
        session: {
          access_token: 'fake-token',
          refresh_token: 'fake-refresh-token',
          expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      // En una implementación real, esto sería una llamada a Supabase
      // const { data, error } = await this.supabaseService.getClient().auth.signUp({
      //   email: registerDto.email,
      //   password: registerDto.password,
      //   options: {
      //     data: {
      //       name: registerDto.name,
      //     },
      //   },
      // });
      
      // if (error) throw new Error(error.message);
      
      // return {
      //   user: data.user,
      //   session: data.session,
      // };

      // Por ahora, simulamos el registro
      return {
        user: {
          id: '1',
          email: registerDto.email,
          name: registerDto.name,
          avatar_url: 'https://github.com/shadcn.png',
        },
        session: {
          access_token: 'fake-token',
          refresh_token: 'fake-refresh-token',
          expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        },
      };
    } catch (error) {
      throw new Error('Error al registrar el usuario');
    }
  }

  async logout(token: string) {
    try {
      // En una implementación real, esto sería una llamada a Supabase
      // const { error } = await this.supabaseService.getClient().auth.signOut();
      // if (error) throw new Error(error.message);
      
      return { success: true };
    } catch (error) {
      throw new Error('Error al cerrar sesión');
    }
  }

  async getCurrentUser(token: string) {
    try {
      // En una implementación real, esto sería una llamada a Supabase
      // const { data, error } = await this.supabaseService.getClient().auth.getUser(token);
      // if (error) throw new Error(error.message);
      
      // return data.user;

      // Por ahora, simulamos la obtención del usuario actual
      return {
        id: '1',
        email: 'usuario@demo.com',
        name: 'Usuario Demo',
        avatar_url: 'https://github.com/shadcn.png',
      };
    } catch (error) {
      throw new Error('Error al obtener el usuario actual');
    }
  }
}
