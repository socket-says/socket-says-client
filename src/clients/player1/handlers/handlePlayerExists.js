// 'use strict';

// const getRandomColor = require('../index');

// const inquirer = require('inquirer');

// module.exports = (socket) => (getRandomColor, payload) => {
//   inquirer
//     .prompt([
//       {
//         type: 'input',
//         name: 'password',
//         message: 'What is your password?',
//       },
//     ])
//     .then((answers) => {
//       console.log('player exists payload after adding pass/highscore: ', payload);

//       payload.user.Password = answers.password;
//       payload.user.Highscore = 0;
//       payload.sequence = getRandomColor() + ' ';


//       if (payload.user.Username && answers.password) {
//         console.log('payload.user.username && answers.password');
//         socket.emit('AUTHENTICATED', payload);
//       }

//       // authenticate password

//       //if answers.username && answers.password(authenticated) {
//       // socket.emit('AUTHENTICATED', payload);
//       // }

//     });
// };