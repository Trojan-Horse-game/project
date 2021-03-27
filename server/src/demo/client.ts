import { exit } from "process";
import { Card } from "../gamelogic/Card";
import { GeneratorSlot } from "../gamelogic/GeneratorSlot";
import { Player, Species } from "../gamelogic/Players";

const io = require("socket.io")();
var socket = io();

var form = document.getElementById("form") || exit();
var join = document.getElementById("join") || exit();
var create = document.getElementById("create") || exit();
var input = <HTMLInputElement>document.getElementById("input") || exit();
var input0 = <HTMLInputElement>document.getElementById("input0") || exit();
var input1 = <HTMLInputElement>document.getElementById("input1") || exit();
var input2 = <HTMLInputElement>document.getElementById("input2") || exit();
var input3 = <HTMLInputElement>document.getElementById("input3") || exit();
var species = document.getElementById("espece") || exit();
var spcSelect =
  <HTMLSelectElement>document.getElementById("especeSelect") || exit();
var msg = document.getElementById("messages") || exit();
var BtnLaunch = document.getElementById("BtnLaunch") || exit();
var hote = false;

var room = "";
var players: Player[] = [];
var currentPlayer = 0;
var myInd = 0;

socket.on("next turn", () => {
  currentPlayer++;
  socket.on("hand", (hand: Card[]) => {
    players[currentPlayer].hand = hand;
    if (hand.length === 0) {
      //Gérer le cas de la distraction nucléaire
    } else {
      //playTurn();
    }
  });
});

socket.on("base", (base: GeneratorSlot[]) => {
  players[currentPlayer].base = base;
  currentPlayer++;
  currentPlayer %= players.length;
});

socket.on("hand", (hand: Card[]) => {
  players[currentPlayer].hand = hand;
  myInd = currentPlayer;
});

socket.on("join game", () => {
  socket.on("pseudo", (psd: string) => {
    socket.on("species", (spc: Species) => {
      players.push(new Player(psd, spc));
    });
  });
});

socket.on("oops", (error: string) => {
  console.log(error);
});

socket.on("game id", (roomId: string) => {
  room = roomId;

  join.style.visibility = "hidden";
  create.style.visibility = "hidden";
  species.style.visibility = "hidden";
  form.style.visibility = "visible";
  if (hote) BtnLaunch.style.display = "inline";
  console.log(room);
});

socket.on("available species", (available: Species[]) => {
  join.style.visibility = "hidden";
  create.style.visibility = "hidden";
  species.style.visibility = "visible";
  for (var i of available) {
    var opt = document.createElement("option");
    opt.value = Species[i];
    opt.text = Species[i];
    spcSelect.add(opt, null);
  }
});

socket.on("chat message", (pseudo: string, message: string) => {
  var txt = document.createTextNode(pseudo + " : " + message);
  var p = document.createElement("p");
  p.appendChild(txt);
  msg.appendChild(p);
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", room, input.value);
    input.value = "";
  }
});

join.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input2.value && input3.value) {
    socket.emit("join game", input2.value, input3.value);
    input2.value = "";
    input3.value = "";
  }
  hote = false;
});

create.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input0.value && input1.value) {
    let spc: Species = (Species as { [key: string]: any })[input1.value];
    socket.emit("create game", input0.value, spc);
    input0.value = "";
    hote = true;
  }
});

species.addEventListener("submit", function (e) {
  e.preventDefault();
  if (spcSelect.value) {
    let spc: Species = (Species as { [key: string]: any })[spcSelect.value];
    socket.emit("choose species", spc);
    species.style.visibility = "hidden";
  }
  socket.on("nb players", (n: number) => {
    for (let i = 0; i < n; i++) {
      socket.on("pseudo", (psd: string) => {
        socket.on("species", (spc: Species) => {
          players.push(new Player(psd, spc));
        });
      });
    }
  });
  console.log(players);
});

BtnLaunch.addEventListener("click", (e) => {
  socket.emit("launch game", room);
});
