'use strict';

// on start of client, prompt for username and password

// on login, display main page, game instructions

// on player selection of new game, intitiate new game

// on player selection of view high scores, display high scores

// on server publish of sequence, display that sequence in player terminal and prompt for response

// on reaching winning criteria, display win message, then return to main after certain amount of time

// on losing, display loss message, then return to main after a certain amount of time


//--------------------TESTING------------------------
// require('dotenv').config();
// const{ io } = require('socket.io-client');
// const PORT = process.env.PORT || 3002;
// const socket = io(`http://localhost:${PORT}`);

// socket.emit('JOIN');
//--------------------TESTING------------------------

const { io } = require('socket.io-client');
require('dotenv').config();
const PORT = process.env.PORT || 3002;
const socket = io(`http://localhost:${PORT}`);
const inquirer = require('inquirer');
const join = 'join';

// function login() {
//   rl.question('What is your name?', function (name) {
//     console.log(`hello ${name}`);

//   });
// }

// function login() {
//   prompt.start();
//   prompt.get(['username', 'password'], function (err, result) {
//     if (err) {
//       return onErr(err);
//     }
//     console.log('Command-line input received:');
//     console.log('  Username: ' + result.username);
//     console.log('  Password: ' + result.password);
//   });
//   socket.emit('LOGGED_IN');
// }

// function game() {
//   let sequence = 'abcd';
//   console.log('Match this sequence: ,', sequence);
//   prompt.start();
//   prompt.get(['Your_turn'], function (err, result) {
//     if(err) {
//       return onErr(err);
//     }
//     if (result.Your_turn === sequence) {
//       console.log('Correct!');
//     }
//   });
// }

// function getRandom() {
// let colors = ['r', 'g', 'b', 'y'];
// return some random value from colors
// }

// let game === true;
// sequence = 'abdc'
// while(game === true)
// publish sequence
// prompt for response
// if response === sequence
// 'correct', prompt sequence + getRandom()
// if (response !== sequence) {
// game = false
// }

socket.emit('JOIN', join);



socket.on('LOG_IN', () => {
  // prompt.start();
  // prompt.get(['username', 'password'], function (err, result) {
  //   if (err) {
  //     return onErr(err);
  //   }
  //   console.log('Command-line input received:');
  //   console.log('  Username: ' + result.username);
  //   console.log('  Password: ' + result.password);
  //   let payload = {
  //     username: result.username,
  //     password: result.password,
  //     sequence: getFirstSequence(),
  //     score: 0,
  //   };

  // let answers;

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
  // console.log('Match this sequence: ', payload.sequence);
  // prompt.start();
  // prompt.get(['Your_turn'], function (err, result) {
  //   if (err) {
  //     return onErr(err);
  //   }
  //   if (result.Your_turn === payload.sequence) {
  //     payload.score++;
  //     payload.sequence = payload.sequence + 'e';
  //     socket.emit('CORRECT', payload);
  //   } else if (result.Your_turn !== payload.sequence) {
  //     socket.emit('INCORRECT', payload);
  //   }

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
  // returnToMain();
});

socket.on('DISPLAY_HIGH_SCORES', (payload) => {
  console.log('Guy has the current high score of infinity');
  // calls function to display high scores
});

// helper functions ----------------

function getFirstSequence() {
  return 'abcd';
}
