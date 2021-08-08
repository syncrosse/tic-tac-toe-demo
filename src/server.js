const path = require("path");

const { Syncrosse } = require('@syncrosse/server');
const express = require('express');
const app = express(); 
const http = require('http');
const server = http.createServer(app);
const syncrosse = new Syncrosse(server);

app.use(express.static(path.join(__dirname, '../build')));
console.log(path.join(__dirname, '../build/static'));

// ================ Incoming ================

// Action: onJoin
// Event: assignRole
syncrosse.onJoin(({user}) => {
    const nextRole = getNextRole();
    user.triggerEvent("assignRole", nextRole);
    numPlayers++;
    console.log(`Player ${numPlayers} has joined`);
});

// Action: playerTurn
// Event: playerMoved
syncrosse.onAction("playerTurn", ({ data, lobby }) => {
    console.log("playerTurn action received");
    console.log(data);
    lobby.triggerEvent("playerMoved", data);
})

// Action: onLeave
syncrosse.onLeave(() => {
    numPlayers--;
    console.log(`A player has left, now ${numPlayers} remain`);
});

syncrosse.start();

server.listen(5001, () => {
    console.log("listening on *5001");
});

// ================ Vars?? ================

let numPlayers = 0;

// ================ Helpers ================

function getNextRole() {
    switch(numPlayers) {
        case 0:
            return "X";
        case 1:
            return "O";
        default: 
            return null;
    }
}