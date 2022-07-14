'use strict';

const mongoose = require('mongoose');
// const { Schema } = mongoose;

const newPlayer = new mongoose.Schema({
  Username: {
    type: String,
    req: true,
    unique: true,
  },
  Password: {
    type: String,
    req: true,
  },
  Highscore: {
    type: Number,
    req: false,
  },
});

const playerModel = mongoose.model('player', newPlayer);

module.exports = playerModel;