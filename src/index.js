'use strict';

const { io } = require('socket.io-client');
require('dotenv').config();
const PORT = process.env.PORT || 3002;
const socket = io(`http://localhost:${PORT}/socket-says`);
const inquirer = require('inquirer');
const chalk = require('chalk');
const bcrypt = require('bcrypt');

socket.on('LOG_IN', () => {

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
        message: 'What is your password?',
      },
    ])
    .then((answers) => {

      payload.user.Password = answers.password;
      payload.user.Highscore = 0;
      payload.sequence = getRandomColor() + ' ';

      if (payload.user.Username && answers.password) {
        socket.emit('CHECK_PASSWORD', payload);
      }
    });
});

socket.on('HANDOFF', (payload) => {
  socket.emit('AUTHENTICATED', payload);
});

// let foundUser;
// let valid;
// let username = payload.user.Username;
// console.log(username);
// try {
//   foundUser = await PlayerData.findOne({ Username: username });
//   console.log(foundUser);
//   valid = bcrypt.compare(answers.password, foundUser.Password);
// } catch (e) {
//   console.log(e.message);
// }

// authenticate password

socket.on('NEW_PLAYER', (payload) => {

  console.log('Username does not exist, create your account by inputting a password');

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'password',
        message: 'What is your password?',
      },
    ])
    .then(async (answers) => {
      payload.user.Password = answers.password;
      payload.user.Highscore = 0;
      payload.sequence = getRandomColor() + ' ';

      payload.user.Password = await bcrypt.hash(payload.user.Password, 10);

      console.log('new player, payload after adding pass/highscore: ', payload);

      socket.emit('CREATE', payload);

    });
});

socket.on('CREATED_NEW', (payload) => {
  console.log('Your account has been created, you may now join');
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
      console.info('Answer: ', answers.main);
      if (answers.main === 'Play game') {
        socket.emit('PLAY_GAME', payload);
      } else if (answers.main === 'View high Scores') {
        socket.emit('VIEW_HIGH_SCORES', payload);
      }
    });

});

socket.on('START', (payload) => {
  console.log('payload in start: ', payload);

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'sequenceMatch',
        message: `Match this sequence: ${payload.sequence}`,
      },
    ])
    .then(answers => {
      if (answers.sequenceMatch === payload.sequence) {
        payload.score++;
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
        message: `Match this sequence: ${payload.sequence}`,
      },
    ])
    .then(answers => {
      console.info('Username:', answers);
      if (answers.sequenceMatch.toString() === payload.sequence) {
        payload.score++;
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
  console.log(`Final Score: ${payload.score}`);
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


function toChalkCase(input) {
  if (input === 'r') {
    input = chalk.red('r');
  }
  if (input === 'g') {
    input = chalk.green('g');
  }
  if (input === 'b') {
    input = chalk.cyan('b');
  }
  if (input === 'y') {
    input = chalk.yellow('y');
  }
  return input;
}
