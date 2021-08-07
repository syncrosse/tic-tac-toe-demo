const { Syncrosse } = require('@syncrosse/server');
const express = require('express');
const app = express(); 
const http = require('http');
const server = http.createServer(app);
const syncrosse = new Syncrosse(server);

syncrosse.onAction("playerTurn", (data) => {
    console.log("playerTurn action received");
    console.log(data);
})
syncrosse.start();
server.listen(5001, () => {
    console.log("listening on *5001");
});