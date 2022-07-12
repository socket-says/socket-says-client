'use strict';

require('dotenv').config();
const { io } = require('socket.io-client');
const socket = io('http://localhost:3002/socketsays');

socket.on('LOGIN', playerLoginHandler);
function playerLoginHandler(payload) {
  setTimeout(() => {
    console.log(`Player1, _________${payload}`);
    socket.emit('_______', payload);
  }, 3000);
}

socket.on('_______', player_______Handler);
function player_______Handler(payload) {
  setTimeout(() => {
    console.log(`Player1, __________ ${payload}`);
    socket.emit('________', payload);
  }, 3000);
}


socket.on('________', player______Handler);
function player______Handler(payload) {
  setTimeout(() => {
    console.log(`Player1, _________ ${payload}`);
  }, 3000);
}

module.exports = { 
  playerLoginHandle,
};
