"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const Players_1 = require("../../dist/gamelogic/Players");
const io = require("socket.io")();
var socket = io();
var form = document.getElementById("form") || process_1.exit();
var join = document.getElementById("join") || process_1.exit();
var create = document.getElementById("create") || process_1.exit();
var input = document.getElementById("input") || process_1.exit();
var input0 = document.getElementById("input0") || process_1.exit();
var input1 = document.getElementById("input1") || process_1.exit();
var input2 = document.getElementById("input2") || process_1.exit();
var input3 = document.getElementById("input3") || process_1.exit();
var species = document.getElementById("espece") || process_1.exit();
var spcSelect = document.getElementById("especeSelect") || process_1.exit();
var msg = document.getElementById("messages") || process_1.exit();
var BtnLaunch = document.getElementById("BtnLaunch") || process_1.exit();
var hote = false;
var room = "";
var players = [];
var currentPlayer = 0;
var myInd = 0;
socket.on("next turn", () => {
    currentPlayer++;
    socket.on("hand", (hand) => {
        players[currentPlayer].hand = hand;
        if (hand.length === 0) {
            //Gérer le cas de la distraction nucléaire
        }
        else {
            //playTurn();
        }
    });
});
socket.on("base", (base) => {
    players[currentPlayer].base = base;
    currentPlayer++;
    currentPlayer %= players.length;
});
socket.on("hand", (hand) => {
    players[currentPlayer].hand = hand;
    myInd = currentPlayer;
});
socket.on("join game", () => {
    socket.on("pseudo", (psd) => {
        socket.on("species", (spc) => {
            players.push(new Players_1.Player(psd, spc));
        });
    });
});
socket.on("oops", (error) => {
    console.log(error);
});
socket.on("game id", (roomId) => {
    room = roomId;
    join.style.visibility = "hidden";
    create.style.visibility = "hidden";
    species.style.visibility = "hidden";
    form.style.visibility = "visible";
    if (hote)
        BtnLaunch.style.display = "inline";
    console.log(room);
});
socket.on("available species", (available) => {
    join.style.visibility = "hidden";
    create.style.visibility = "hidden";
    species.style.visibility = "visible";
    for (var i of available) {
        var opt = document.createElement("option");
        opt.value = Players_1.Species[i];
        opt.text = Players_1.Species[i];
        spcSelect.add(opt, null);
    }
});
socket.on("chat message", (pseudo, message) => {
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
        let spc = Players_1.Species[input1.value];
        socket.emit("create game", input0.value, spc);
        input0.value = "";
        hote = true;
    }
});
species.addEventListener("submit", function (e) {
    e.preventDefault();
    if (spcSelect.value) {
        let spc = Players_1.Species[spcSelect.value];
        socket.emit("choose species", spc);
        species.style.visibility = "hidden";
    }
    socket.on("nb players", (n) => {
        for (let i = 0; i < n; i++) {
            socket.on("pseudo", (psd) => {
                socket.on("species", (spc) => {
                    players.push(new Players_1.Player(psd, spc));
                });
            });
        }
    });
    console.log(players);
});
BtnLaunch.addEventListener("click", (e) => {
    socket.emit("launch game", room);
});
//# sourceMappingURL=client.js.map