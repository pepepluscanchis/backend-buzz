import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    // 1. Si no hay token, bloqueamos el paso de una
    if (!token) {
      throw new UnauthorizedException('Acceso denegado. No se encontró un token.');
    }

    try {
      // 2. Verificamos si el token es real y no ha expirado
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'SUPER_SECRETO_DE_BUZZ_2026',
      });
      
      // 3. Inyectamos los datos del usuario en la petición para usarlo después
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado.');
    }

    return true;
  }

  // Función auxiliar para sacar el token del formato "Bearer eyJhbG..."
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}