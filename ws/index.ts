import { Server } from "socket.io";
import { Client } from "./classes/Clients";

const io = new Server(3001, {
  cors: {
    origin: "*",
  },
});
const clients: Client[] = [];

io.on("connection", (socket) => {
  socket.emit("connected", socket.id);
  socket.on("join", (name) => {
    clients.push(new Client(name, socket.id));
    socket.broadcast.emit("new client", socket.id, name);
  });
  socket.on("get all", () => {
    socket.emit("all clients", clients);
  });
  socket.on("move", (x: number, y: number) => {
    const client = clients.find((client) => client.socket_id === socket.id);
    if (client) {
      client.x = x;
      client.y = y;
      socket.broadcast.emit("client location", client?.socket_id, x, y);
    }
  });
  socket.on("broadcast", () => {
    socket.broadcast.emit("broadcast", clients);
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("client disconnect", socket.id);
    clients.splice(
      clients.findIndex((client) => client.socket_id === socket.id),
      1,
    );
  });
});
