import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(TrackingGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers.authorization?.toString().replace('Bearer ', '');

    if (!token) {
      this.logger.warn(`Conexión rechazada (sin token): ${client.id}`);
      client.disconnect(true);
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });
      client.data.user = payload;
      this.logger.log(`Dispositivo autenticado: ${client.id} (${payload.role})`);
    } catch {
      this.logger.warn(`Conexión rechazada (token inválido): ${client.id}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Dispositivo desconectado: ${client.id}`);
  }

  // 1. El pasajero (o chofer) entra a la sala de una ruta especifica
  @SubscribeMessage('joinRoute')
  handleJoinRoute(@MessageBody() data: { routeId: string }, @ConnectedSocket() client: Socket) {
    client.join(data.routeId);
  }

  // 2. El pasajero sale de la sala cuando cierra el mapa
  @SubscribeMessage('leaveRoute')
  handleLeaveRoute(@MessageBody() data: { routeId: string }, @ConnectedSocket() client: Socket) {
    client.leave(data.routeId);
  }

  // 3. El chofer transmite, pero el servidor solo le avisa a los de su sala
  @SubscribeMessage('updateLocation')
  async handleLocationUpdate(
    @MessageBody() data: { busId: string; driverName: string; routeId: string; lat: number; lng: number },
    @ConnectedSocket() client: Socket,
  ) {
    // Solo un chofer autenticado puede transmitir/spoofear una posición.
    if (client.data.user?.role !== 'DRIVER') {
      this.logger.warn(`Bloqueado updateLocation de un socket no-chofer: ${client.id}`);
      return;
    }

    // Persistimos la última posición conocida (busId viaja como placa del bus).
    try {
      await this.prisma.bus.update({
        where: { plate: data.busId },
        data: { lastLat: data.lat, lastLng: data.lng, lastLocationAt: new Date() },
      });
    } catch {
      this.logger.warn(`No se pudo persistir ubicación: bus con placa ${data.busId} no existe`);
    }

    // Al usar .to(data.routeId), evitamos que la ubicacion se cruce con otros buses
    this.server.to(data.routeId).emit('driverLocationBroadcast', data);
  }
}
