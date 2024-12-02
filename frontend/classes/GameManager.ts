import { Socket } from "socket.io-client";
import { Character } from "./Character";

export const rand = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min);
};

export class GameManager {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  me: Character;
  characters: Character[] = [];
  bgColor = "black";
  socket: Socket;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    socket: Socket,
    name: string,
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.backgroundColor = this.bgColor;
    this.socket = socket;

    window.onresize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };

    this.me = new Character(
      100,
      100,
      `rgb(${rand(100, 255)}, ${rand(100, 255)}, ${rand(100, 255)})`,
      name,
      socket.id as string,
    );
  }

  addCharacter({ name, socket_id }: { name: string; socket_id: string }) {
    const character = new Character(
      100,
      100,
      `rgb(${rand(100, 255)}, ${rand(100, 255)}, ${rand(100, 255)})`,
      name,
      socket_id,
    );
    this.characters.push(character);
    return character;
  }

  attachListeners() {
    window.onkeydown = (e) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (this.me.y > 0) this.me.y -= 10;
          break;
        case "ArrowDown":
        case "s":
          if (this.me.y < this.canvas.height - this.me.size) this.me.y += 10;
          break;
        case "ArrowLeft":
        case "a":
          if (this.me.x > 0) this.me.x -= 10;
          break;
        case "ArrowRight":
        case "d":
          if (this.me.x < this.canvas.width - this.me.size) this.me.x += 10;
          break;
      }
      this.socket.emit("move", this.me.x, this.me.y);
    };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.characters.forEach((character) => character.draw(this.ctx));
    this.me.draw(this.ctx);
    requestAnimationFrame(() => this.animate());
  }
}
