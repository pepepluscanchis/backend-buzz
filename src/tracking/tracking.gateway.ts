import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log(`Nuevo dispositivo conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Dispositivo desconectado: ${client.id}`);
  }

  // 1. El pasajero (o chofer) entra a la sala de una ruta especifica
  @SubscribeMessage('joinRoute')
  handleJoinRoute(
    @MessageBody() data: { routeId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.routeId);
    console.log(`Cliente ${client.id} se unio a la sala de la ruta: ${data.routeId}`);
  }

  // 2. El pasajero sale de la sala cuando cierra el mapa
  @SubscribeMessage('leaveRoute')
  handleLeaveRoute(
    @MessageBody() data: { routeId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.routeId);
    console.log(`Cliente ${client.id} salio de la sala de la ruta: ${data.routeId}`);
  }

  // 3. El chofer transmite, pero el servidor solo le avisa a los de su sala
  @SubscribeMessage('updateLocation')
  handleLocationUpdate(
    @MessageBody() data: { busId: string; driverName: string; routeId: string; lat: number; lng: number },
    @ConnectedSocket() client: Socket,
  ) {
    // Descomenta la siguiente linea si quieres ver en la consola CADA paso que da el bus
    // console.log(`Bus ${data.busId} (${data.driverName}) en Ruta ${data.routeId} -> ${data.lat}, ${data.lng}`);
    
    // Al usar .to(data.routeId), evitamos que la ubicacion se cruce con otros buses
    this.server.to(data.routeId).emit('driverLocationBroadcast', data);
  }
}