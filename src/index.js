'use strict';

const { io } = require('socket.io-client');
require('dotenv').config();
const PORT = process.env.PORT || 3002;
const socket = io(`http://localhost:${PORT}/socket-says`);
const inquirer = require('inquirer');
const chalk = require('chalk');

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
      payload.gameScore = 0;

      if (payload.user.Username && answers.password) {
        socket.emit('AUTHENTICATED', payload);
      }

      // authenticate password

      //if answers.username && answers.password(authenticated) {
      // socket.emit('AUTHENTICATED', payload);
      // }

    });

});

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
    .then(answers => {
      payload.user.Password = answers.password;
      payload.user.Highscore = 0;
      payload.sequence = getRandomColor() + ' ';
      payload.gameScore = 0;

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
  // takes in player-specific payload
  // uses sequence and score in player's payload for gameplay and increments accordingly

  // reset score to 0, in case player got here from returning to main after a loss, so previous score does not persist in payload
  payload.score = 0;
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
        payload.gameScore++;
        payload.sequence = payload.sequence + getRandomColor() + ' ';
        socket.emit('CORRECT', payload);
      } else if (answers.sequenceMatch !== payload.sequence) {
        socket.emit('INCORRECT', payload);
      }
    });

});

socket.on('NEXT_SEQUENCE', (payload) => {
  // takes in player-specific payload
  // uses sequence and score in player's payload for gameplay and increments accordingly
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'sequenceMatch',
        message: `Match this sequence: ${payload.sequence}`,
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
  // takes in player-specific payload
  // logs that player's final score
  payload.sequence = getRandomColor() + ' ';

  console.log(`Sorry ${payload.user.Username}, that's incorrect! Game Over`);
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
      // created new event RETURN_TO_MAIN so player could return to main menu without needing to re-join a room
      socket.emit('RETURN_TO_MAIN', payload);
    });

});

socket.on('DISPLAY_HIGH_SCORES', (payload) => {

  console.log('| --- Player --- | -- Score -- |');
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