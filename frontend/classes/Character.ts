export class Character {
  x: number;
  y: number;
  size: number;
  color: string;
  name: string;
  socket_id: string;

  constructor(
    x: number,
    y: number,
    color: string,
    name: string,
    socket_id: string,
  ) {
    this.x = x;
    this.y = y;
    this.size = 25;
    this.color = color;
    this.name = name;
    this.socket_id = socket_id;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.font = "20px Monospace";
    ctx.fillText(
      this.name,
      this.x - this.name.length * 5,
      this.y - this.size * 1.75,
    );
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  updateLocation(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
