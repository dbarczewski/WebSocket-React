import { Logger } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { MessageBody } from '@nestjs/websockets';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import WebSocket, { Server } from 'ws';

interface GetFieldOptions {
  all?: boolean;
  getOwnPlace?: string;
}

interface IdentifiableWebSocket extends WebSocket {
  id: string;
}

interface IdentifiableServer extends Server {
  clients: Set<IdentifiableWebSocket>;
}

enum PlaceReservation {
  FREE,
  RESERVED,
  YOURS,
}

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: IdentifiableServer;
  private logger: Logger = new Logger('EventsGateway');

  private _field = [
    [null, null],
    [null, null],
    [null, null],
    [null, null],
  ];

  sendToOneClient(client: IdentifiableWebSocket, type: string, content: any) {
    const payload = {
      type,
      content,
    };
    client.send(JSON.stringify(payload));
  }

  set field(field) {
    this._field = field;
  }

  get field() {
    return this._field;
  }

  getField({ all, getOwnPlace }: GetFieldOptions = {}) {
    if (all) {
      return this.field;
    }
    if (getOwnPlace) {
      return this.field.map((row) => {
        return row.map((cell) => {
          if (cell === null) return PlaceReservation.FREE;
          if (cell && cell === getOwnPlace) return PlaceReservation.YOURS;
          return PlaceReservation.RESERVED;
        });
      });
    }
    return this.field.map((row) => {
      return row.map((cell) => {
        return cell ? PlaceReservation.FREE : PlaceReservation.YOURS;
      });
    });
  }

  setField(pos: number[], id: string) {
    if (
      this.field[pos[0]] === undefined ||
      this.field[pos[0]][pos[1]] === undefined
    ) {
      return false;
    }
    if (!this.field[pos[0]][pos[1]]) {
      this.field[pos[0]][pos[1]] = id;
      return true;
    }
    return false;
  }

  sendToAllClients(type: string, content: any) {
    this.server.clients.forEach((client: IdentifiableWebSocket) => {
      this.sendToOneClient(client, type, content);
    });
  }

  @SubscribeMessage('events')
  handleMessage(@MessageBody() data: any) {
    this.server.clients.forEach((client) => {
      client.send(data.message);
    });
    return data;
  }

  @SubscribeMessage('field')
  handleInitField(
    @MessageBody() data: any,
    @ConnectedSocket() client: IdentifiableWebSocket,
  ) {
    this.sendToOneClient(
      client,
      'field',
      this.getField({ getOwnPlace: client.id }),
    );
    return data;
  }

  @SubscribeMessage('buy')
  handleBuy(
    @MessageBody() data: any,
    @ConnectedSocket() client: IdentifiableWebSocket,
  ) {
    if (!this.setField(data.pos, client.id)) {
      this.sendToOneClient(client, 'error', 'Place is not available');
      return;
    }
    this.sendFieldToAllClients(this.server.clients);
    return;
  }

  sendFieldToAllClients(clients: Set<IdentifiableWebSocket>) {
    clients.forEach((client) => {
      this.sendToOneClient(
        client,
        'field',
        this.getField({ getOwnPlace: client.id }),
      );
    });
  }

  afterInit() {
    this.logger.log('INIT');
  }

  handleConnection(client: IdentifiableWebSocket, ...args: any[]) {
    if (!args[0].url.includes('/?user=', '')) {
      client.send('Please provide a username in the url: /?user=YourUsername');
      client.close();
      this.logger.log('Client tried to connect with incorrect username');
      return;
    }
    const username = args[0].url.replace('/?user=', '');
    client.id = username;
    this.logger.log(`Client connected`);
  }

  handleDisconnect(client: IdentifiableWebSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
