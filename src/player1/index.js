'use strict';

const { io } = require('socket.io-client');
require('dotenv').config();
const PORT = process.env.PORT || 3002;
const socket = io(`http://localhost:${PORT}/socket-says`);
const inquirer = require('inquirer');
const chalk = require('chalk');
const bcrypt = require('bcrypt');

socket.on('LOG_IN', (socketId) => {

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'username',
        message: 'What is your username?',
      },
    ])
    .then(answers => {
      console.info(chalk.cyan('Username:', answers.username));
      let payload = {
        user: {
          Username: answers.username,
          socketId: socketId,
        },
      };
      socket.emit('CHECK_USERNAME', payload);
    });

});

socket.on('PLAYER_EXISTS', (payload) => {

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'password',
        message: `Welcome back, ${payload.user.Username}! Please enter your password:`,
      },
    ])
    .then((answers) => {

      payload.user.Password = answers.password;
      payload.user.Highscore = 0;
      payload.sequence = getRandomColor() + ' ';
      payload.gameScore = 0;
      if (payload.user.Username && answers.password) {
        socket.emit('CHECK_PASSWORD', payload);
      }
    });
});

socket.on('HANDOFF', (payload) => {
  socket.emit('AUTHENTICATED', payload);
});

socket.on('NEW_PLAYER', (payload) => {

  // console.log('User does not exist, please create your account by entering a password:');

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'password',
        message: 'User does not exist, please create your account by entering a password:',
      },
    ])
    .then(async (answers) => {
      payload.user.Password = answers.password;
      payload.user.Highscore = 0;
      payload.sequence = getRandomColor() + ' ';
      payload.gameScore = 0;
      payload.user.Password = await bcrypt.hash(payload.user.Password, 10);

      socket.emit('CREATE', payload);
    });
});

socket.on('CREATED_NEW', (payload) => {
  console.log('Your account has been created, you may now join!');
  socket.emit('AUTHENTICATED', payload);
});

socket.on('MAIN', (payload) => {

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'main',
        message: chalk.yellow('What would you like to do?'),
        choices: ['Play game', 'View high Scores'],
      },
    ])
    .then(answers => {
      if (answers.main === 'Play game') {
        socket.emit('PLAY_GAME', payload);
      } else if (answers.main === 'View high Scores') {
        socket.emit('VIEW_HIGH_SCORES', payload);
      }
    });

});

socket.on('PLAYER_JOINED', (payload) => {
  console.log(`
  ${payload.user.Username} has joined the gaming area.`);
});

socket.on('PLAYER_STARTED', (payload) => {
  console.log(`
  ${payload.user.Username} has started a new game!`);
});

socket.on('PLAYER_WON', (payload) => {
  console.log(`
  ${payload.user.Username} has won a round! Their current score is ${payload.gameScore}.`);
});

socket.on('PLAYER_LOST', (payload) => {
  console.log(`
  ${payload.user.Username} has lost! Their final score was ${payload.gameScore}.`);
});

socket.on('START', (payload) => {

  payload.gameScore = 0;

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'sequenceMatch',
        message: chalk.red(`Match this sequence: `) + chalk.cyan(`${payload.sequence}`),
      },
    ])
    .then(answers => {
      if (answers.sequenceMatch === payload.sequence) {
        payload.gameScore++;
        payload.sequence = payload.sequence + getRandomColor() + ' ';
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
        message: chalk.red(`That's correct! Please match NEW sequence: `) + chalk.cyan(`${payload.sequence}`),
      },
    ])
    .then(answers => {
      if (answers.sequenceMatch.toString() === payload.sequence) {
        payload.gameScore++;
        payload.sequence = payload.sequence + getRandomColor() + ' ';
        socket.emit('CORRECT', payload);
      } else if (answers.sequenceMatch !== payload.sequence) {
        socket.emit('INCORRECT', payload);
      }
    });

});

socket.on('LOST', (payload) => {

  payload.sequence = getRandomColor() + ' ';

  console.log('Incorrect, game over!');
  console.log(`Final Score: ${payload.gameScore}`);
  inquirer.prompt([
    {
      type: 'list',
      name: 'returnToMain',
      message: 'Hit Enter to return to Main',
      choices: [chalk.yellow('Return')],
    },
  ])
    .then(answers => {
      socket.emit('RETURN_TO_MAIN', payload);
    });
});

socket.on('DISPLAY_HIGH_SCORES', (payload) => {

  console.log('');
  console.log('| --- Player --- | -- Score -- |');
  console.log('| --- Brady ---- | ---- 15 --- |');
  console.log('| --- Simon ---- | ---- 13 --- |');
  console.log('| --- Andrew --- | ---- 12 --- |');
  console.log('| --- Joe ------ | ---- 10 --- |');
  console.log('| --- Tommy ---- | ---- 8 ---- |');
  console.log('| --- Lisa ----- | ---- 6 ---- |');
  console.log('| --- Jim ------ | ---- 3 ---- |');
  console.log('');

  // calls function to display high scores
  inquirer.prompt([
    {
      type: 'list',
      name: 'returnToMain',
      message: 'Hit Enter to return to Main',
      choices: [chalk.yellow('Return')],
    },
  ])
    .then(answers => {
      socket.emit('RETURN_TO_MAIN', payload);
    });

});

// helper functions ----------------

function getRandomColor() {
  // let colors = [chalk.red('r'), chalk.green('g'), chalk.cyan('b'), chalk.yellow('y')];
  let colors = ['r', 'g', 'b', 'y'];
  return colors[getRandomInt(0, 4)];
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// function toChalkCase(input) {
//   if (input === 'r') {
//     input = chalk.red('r');
//   }
//   if (input === 'g') {
//     input = chalk.green('g');
//   }
//   if (input === 'b') {
//     input = chalk.cyan('b');
//   }
//   if (input === 'y') {
//     input = chalk.yellow('y');
//   }
//   return input;
// }
