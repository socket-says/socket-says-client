// 'use strict';

// const inquirer = require('inquirer');
// const chalk = require('chalk');

// module.exports = (socket) => () => {
//   inquirer
//     .prompt([
//       {
//         type: 'input',
//         name: 'username',
//         message: 'What is your username?',
//       },
//     ])
//     .then(answers => {
//       console.info(chalk.cyan('Username:', answers.username));
//       let payload = {
//         user: {
//           Username: answers.username,
//         },
//       };
//       socket.emit('CHECK_USERNAME', payload);
//     });
// };
