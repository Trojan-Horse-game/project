import { createServer } from "http";
import { io as Client } from "socket.io-client";
import { Server } from "socket.io";
import { Species } from "../gamelogic/Players";

describe("Back-front communication testing", () => {
  let io: any, serverSocket: any, clientSocket: any;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    require("../routes/game.routes")(io);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = Client(`http://localhost:${port}`);
      io.on("connection", (socket: any) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("should work", (done) => {
    clientSocket.on("hello", (arg: any) => {
      expect(arg).toBe("world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  test("should work (with ack)", (done) => {
    serverSocket.on("hi", (cb: any) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg: any) => {
      expect(arg).toBe("hola");
      done();
    });
  });

  test("chat should work", (done) => {
    clientSocket.on("chat message", (username: string, message: string) => {
      expect(username).toBe("test username");
      expect(message).toBe("test message");
      done();
    });
    serverSocket.emit("chat message", "test username", "test message");
  });

  test("create game should work", (done) => {
    serverSocket.on("create game", (pseudo: string, species: Species) => {
      expect(pseudo).toBe("test username");
      expect(species).toBe(Species.Sonyas);
      done();
    });
    clientSocket.emit("create game", "test username", Species.Sonyas);
  });

  test("get roomdId should work", (done) => {
    clientSocket.on("game id", (roomId: string) => {
      expect(roomId).toBe(clientSocket.id);
      done();
    });
    serverSocket.emit("game id", clientSocket.id);
  });

  test("join game should work", (done) => {
    serverSocket.on("join game", (pseudo: string, roomId: string) => {
      expect(roomId).toBe("test");
      expect(pseudo).toBe("username test");
      done();
    });
    clientSocket.emit("join game", "username test", "test");
  });

  test("oops should work", (done) => {
    clientSocket.on("oops", (err: string) => {
      expect(err).toBe("ERROR: Could not find game !");
      done();
    });
    serverSocket.emit("oops", "ERROR: Could not find game !");
  });
});
