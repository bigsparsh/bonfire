export class Client {
  name: string;
  socket_id: string;
  x: number = 0;
  y: number = 0;

  constructor(name: string, socket_id: string) {
    this.name = name;
    this.socket_id = socket_id;
  }
}
