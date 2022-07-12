'use strict';

const { io } = require('socket.io-client');
require('dotenv').config();
const PORT = process.env.PORT || 3002;
const socket = io(`http://localhost:${PORT}/socket-says`);
const inquirer = require('inquirer');
const join = 'join';

socket.emit('JOIN', join);

socket.on('LOG_IN', () => {

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'username',
        message: 'What is your username?',
      },
      {
        type: 'input',
        name: 'password',
        message: 'What is your password?',
      },
    ])
    .then(answers => {
      console.info('Username:', answers);
      let payload = {
        username: answers.username,
        password: answers.password,
        sequence: getFirstSequence(),
        score: 0,
      };
      console.log(payload);
      if (answers.username && answers.password) {
        socket.emit('LOGGED_IN', payload);
      }
    });

});

socket.on('MAIN', (payload) => {

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'main',
        message: 'What would you like to do?',
        choices: ['Play game', 'View high Scores'],
      },
    ])
    .then(answers => {
      console.info('Answer: ', answers.main);
      if (answers.main === 'Play game') {
        socket.emit('PLAY_GAME', payload);
      } else if (answers.main === 'View high Scores') {
        socket.emit('VIEW_HIGH_SCORES', payload);
      }
    });

});

socket.on('START', (payload) => {

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'sequenceMatch',
        message: `Match this sequence: ${payload.sequence}`,
      },
    ])
    .then(answers => {
      console.info('Username:', answers);
      if (answers.sequenceMatch === payload.sequence) {
        payload.score++;
        payload.sequence = payload.sequence + 'e';
        socket.emit('CORRECT', payload);
      } else if (answers.sequenceMatch !== payload.sequence) {
        socket.emit('INCORRECT', payload);
      }
    });

});

socket.on('NEXT_SEQUENCE', (payload) => {

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'sequenceMatch',
        message: `Match this sequence: ${payload.sequence}`,
      },
    ])
    .then(answers => {
      console.info('Username:', answers);
      if (answers.sequenceMatch === payload.sequence) {
        payload.score++;
        payload.sequence = payload.sequence + 'e';
        socket.emit('CORRECT', payload);
      } else if (answers.sequenceMatch !== payload.sequence) {
        socket.emit('INCORRECT', payload);
      }
    });

});

socket.on('LOST', (payload) => {
  
  console.log('Incorrect, game over!');
  console.log(`Final Score: ${payload.score}`);
  inquirer.prompt([
    {
      type: 'list',
      name: 'returnToMain',
      message: 'Hit Enter to return to Main',
      choices: ['Return'],
    },
  ])
    .then(answers => {
      socket.emit('LOGGED_IN', payload);
    });

});

socket.on('DISPLAY_HIGH_SCORES', (payload) => {

  console.log('| -- Player -- | -- Score -- |');
  console.log('| -- Player 1 -- | -- 3 -- |');
  console.log('| -- Player 2 -- | -- 6 -- |');
  console.log('| -- Player 3 -- | -- 9 -- |');
  console.log('| -- Player 4 -- | -- 10 -- |');
  // calls function to display high scores
  inquirer.prompt([
    {
      type: 'list',
      name: 'returnToMain',
      message: 'Hit Enter to return to Main',
      choices: ['Return'],
    },
  ])
    .then(answers => {
      socket.emit('LOGGED_IN', payload);
    });

});

// helper functions ----------------

function getFirstSequence() {
  return 'abcd';
}

// function getRandom() {
// let colors = ['r', 'g', 'b', 'y'];
// return some random value from colors
// }
