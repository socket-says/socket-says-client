'use strict';

// const { createServer } = require('http');
// const { Server } = require('socket.io');
// const Client = require('socket.io-client');

// describe('my awesome project', () => {
//   let io, serverSocket, clientSocket;

//   beforeAll((done) => {
//     const httpServer = createServer();
//     io = new Server(httpServer);
//     httpServer.listen(() => {
//       const port = httpServer.address().port;
//       clientSocket = new Client(`http://localhost:${port}`);
//       io.on('connection', (socket) => {
//         serverSocket = socket;
//       });
//       clientSocket.on('connect', done);
//     });
//   });

//   afterAll(() => {
//     io.close();
//     clientSocket.close();
//   });

//   test('should work', (done) => {
//     clientSocket.on('hello', (arg) => {
//       expect(arg).toBe('world');
//       done();
//     });
//     serverSocket.emit('hello', 'world');
//   });

//   test('should work (with ack)', (done) => {
//     serverSocket.on('hi', (cb) => {
//       cb('hola');
//     });
//     clientSocket.emit('hi', (arg) => {
//       expect(arg).toBe('hola');
//       done();
//     });
//   });
// });

// const handleLogin = require('../../src/server/handleLogin');

// describe('Tests for client logging in', () => {
//   test.skip('Client joining server, displays login prompt', () => {
//     // Client joining server

//     // expect(console.log).toEqual(''); // displays login prompt
//   })

//   test.skip('After client logs in, main-page prompt is displayed on client screen', () => {
//     // After client logs in

//     // expect(console.log).toEqual(''); // main-page prompt is displayed on client screen
//   })
// })