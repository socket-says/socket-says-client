# Software Requirements

## TO RUN THIS APP

1. Download the repo to your local machine
2. Add a .env file inside BOTH player1 and player2 folders (where the .env.sample files currently exists)
3. Copy the contents of the .env.sample file into your new .env file in each folder:

```
PORT=3001
```

## Vision

Play the classic Simon Says game on your computer. Text-based memory game that incorporates auth, high scores, and of course colors! Game utilizes only back-end technologies like Socket.io, Chalk, and MongoDB to deliver a front-end gaming experience.

## Scope (In/Out)

### In

This app will:

- Allow a user to connect to the event server with Socket.io
- Allow a user to log in with username/password
- Allow a logged-in user to play a game and see high scores
- Give the user some choices for what kind of sequences they’ll be memorizing (classic colors, alternative colors, numbers, etc)

### Out

This app will not:

- Allow a user to play a game or see high scores unless they have logged in
- Include a front end user interface (it is back end only!)
- Communicate with an outside API for data

### Minimum Viable Product

- Event server
  - Will manage all events and log specific events and player-relevant data to the server’s command line
  - Send confirmation of socket connection when Player 1 connects
  - Prompt Player 1 for username and password to log in
  - Send prompt to begin new game or view high scores
  - Send a new string for each new game or round to Player 1 terminal
  - Will increase string by one character after each win and re-display to Player 1 terminal
  - Will clear the console after a brief time period - Time period to be slightly increased with each new round
  - Will increase player’s score with each win
  - Upon loss, will re-display prompt to begin new game or view high scores
  - Will communicate with MongoDB to access, create, and update players and high scores

- Player 1 (client)
  - Will connect to the server upon running correct file in Node.js
  - Will log in with username and password
  - Will receive game instructions
  - Can play rounds of the game until they lose, then will be redirected to home terminal

### Stretch

- Two player capability
- Literal keystroke tracking for sequences (up, down, left, right arrows)

## Functional Requirements

- Administrators can delete user accounts
- Players can play the game and view high scores

### Data Flow

- Main screen
  - Player will create account if they don’t have one yet
  - Player can start a new game or view high scores
- New game
  - Server will display a new game message and instructions
  - Game will begin and display a sequence for the player to replicate
  - Player will attempt to correctly replicate the displayed sequence
  - Upon successful replication, server will display sequence again with a new symbol add, lengthening the sequence by 1 each iteration
  - Player will return inputs until they don’t do so correctly or until they reach winning scenario criteria
  - A message will display the results
  - Player will be returned to main screen
- View High Scores
  - Database will be referenced and a table will be displayed showing the top x-amount of high scores

## Non-Functional Requirements

### Security

Users will not be able to play the game without first logging in with a username and password.  Passwords will be encrypted using ‘bcrypt’.  Logged in players will have permissions to play the game and view high scores.  Administrators will be able to remove players from the database.

### Testability

Tests will cover edge cases and core features/functions of the app. WebSocket server events will require usage of mock tests, via Jest – which will also provide overall testing.

- Server will correctly commit new players to database.
- Server will retrieve previous players from database.
- Server will correctly respond to correct player input
- Server will correctly respond to incorrect player input.
- Edge case examples:
- Player inputs: Even when inputting a single color such as “red”, are all of the acceptable inputs recognized? (RED? R? r? red? etc)
- Are other player inputs such as spaces or typos handled correctly?
- Current high score is 0 rounds.
