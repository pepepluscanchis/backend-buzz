import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard'; 

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // === AQUÍ ESTÁ LA NUEVA PUERTA PARA FLUTTER ===
  @Post('register')
  register(@Body() body: any) {
    // Aquí recibimos el name, email, password y role que manda Flutter
    // y se los pasamos a tu servicio para que los guarde en Neon.
    return this.authService.register(body);
  }

  // Nueva ruta para Flutter: http://10.0.2.2:3000/auth/profile
  @UseGuards(AuthGuard) // Candado activado
  @Get('profile')
  getProfile(@Request() req) {
    return {
      name: "Renato Chofer",
      route: { name: "Ruta A - Trujillo Centro" },
      vehicle: { plate: "T3C-987" }
    };
  }
}