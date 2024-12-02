"use client";
import { GameManager } from "@/classes/GameManager";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import {
  FaArrowCircleDown,
  FaArrowCircleLeft,
  FaArrowCircleRight,
  FaArrowCircleUp,
} from "react-icons/fa";
import { Socket, io } from "socket.io-client";

const Lobby = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [manager, setManager] = useState<GameManager>();
  const [username, setUsername] = useState<string>();
  const [socket, setSocket] = useState<Socket>();
  const [myInterval, setMyInterval] = useState<NodeJS.Timeout>();

  const handleInit = () => {
    if (!username || username.length < 3) {
      console.log("fcuked p");
      return;
    }

    const ws = io("https://bonfire-e9t1.onrender.com");

    setSocket(ws);
  };

  useEffect(() => {
    if (socket && username) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const gameManager = new GameManager(canvas, ctx, socket, username);
          setManager(gameManager);
          gameManager.attachListeners();
          gameManager.animate();
          socket.emit("get all");
          socket.on("client disconnect", (id: string) => {
            gameManager.characters = gameManager.characters.filter(
              (c) => c.socket_id !== id,
            );
          });
          socket.on(
            "all clients",
            (
              characters: {
                name: string;
                socket_id: string;
                x: number;
                y: number;
              }[],
            ) => {
              characters.forEach((c) => {
                gameManager
                  .addCharacter({
                    name: c.name,
                    socket_id: c.socket_id,
                  })
                  .updateLocation(c.x, c.y);
              });
            },
          );
          socket.on("new client", (id: string, username: string) => {
            gameManager.addCharacter({
              name: username,
              socket_id: id,
            });
          });
          socket.on("client location", (id: string, x: number, y: number) => {
            gameManager.characters
              .find((c) => c.socket_id === id)
              ?.updateLocation(x, y);
          });

          socket.emit("join", username);
        }
      }
    }
  }, [socket, username]);

  return (
    <div className="relative h-screen w-screen">
      {!socket && (
        <div className="absolute top-0 left-0 backdrop-blur-xl grid place-items-center h-screen w-screen z-10 bg-stone-800">
          <div className="flex flex-col gap-2 justify-center items-center">
            <h1 className="text-white text-3xl font-serif">
              Enter your username
            </h1>
            <Input
              type="text"
              className="text-white text-xl"
              placeholder="Username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <Button
              variant="secondary"
              className="w-full text-base"
              onClick={handleInit}
            >
              Start Bonfire
            </Button>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center text-5xl absolute bottom-4 right-4 text-white z-0 md:hidden">
        <div>
          <FaArrowCircleUp
            onMouseDown={() => {
              setMyInterval(
                setInterval(() => {
                  if (manager && manager.me.y > 0) manager.me.y -= 5;
                }, 1000 / 60),
              );
            }}
            onMouseUp={() => {
              clearInterval(myInterval);
            }}
            onMouseLeave={() => {
              clearInterval(myInterval);
            }}
          />
        </div>
        <div className="flex gap-12">
          <FaArrowCircleLeft
            onMouseDown={() => {
              setMyInterval(
                setInterval(() => {
                  if (manager && manager.me.x > 0) manager.me.x -= 5;
                }, 1000 / 60),
              );
            }}
            onMouseUp={() => {
              clearInterval(myInterval);
            }}
            onMouseLeave={() => {
              clearInterval(myInterval);
            }}
          />
          <FaArrowCircleRight
            onMouseDown={() => {
              setMyInterval(
                setInterval(() => {
                  if (manager && manager.me.x < window.innerWidth)
                    manager.me.x += 5;
                }, 1000 / 60),
              );
            }}
            onMouseUp={() => {
              clearInterval(myInterval);
            }}
            onMouseLeave={() => {
              clearInterval(myInterval);
            }}
          />
        </div>
        <div>
          <FaArrowCircleDown
            onMouseDown={() => {
              setMyInterval(
                setInterval(() => {
                  if (manager && manager.me.y < window.innerHeight)
                    manager.me.y += 5;
                }, 1000 / 60),
              );
            }}
            onMouseUp={() => {
              clearInterval(myInterval);
            }}
            onMouseLeave={() => {
              clearInterval(myInterval);
            }}
          />
        </div>
      </div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};
export default Lobby;
