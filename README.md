# TIC TAC TOE
This is a Tic Tac Toe (Noughts & Crosses) game that can be played by 1 - 5 players on a board of size 3x3 - 10x10 squares.

## Playing the Game
By default, the game loads with a 3x3 game board and two players - "Noughts" and "Crosses". The players are listed in the info panel below the board, with the white box indicating the player who has the current turn.

Moves are made by clicking on the board's squares.

The game is won when a single player occupies an entire line of squares across the board (vertical, horizontal, or diagonal).

- The __New Game__ starts a new game with the current players
- The __Reset__ button returns the game to the initial defaults

The current status of the game is saved in the browser's memory and can be continued when the page is reopened.

## Setup
The setup screen allows the setup of player options and the board size.
- Board size can be chosen from the select box (changing this restarts the current game)
- Players can be added or removed (changing number of players also restarts the current game)
- The __Change Colour__ button assigns a new random colour to the player
- If a player is registered with *Gravatar*, entering an email address will display their personal avatar image in place of the default

## Technologies Used
- HTML / CSS / Javascript
- jQuery
- underscore.js
- Git / Github
- Gravatar
- MD5 algorithm (https://css-tricks.com/snippets/javascript/javascript-md5/)
- Browser localStorage / JSON

## Approach
The game board is represented by a 2-dimensional nested array structure, as follows:

```javascript
var board = [ [ X , _ , _ ],
              [ _ , _ , _ ],
              [ _ , O , _ ] ]
```
Square bracket notation can then be used to retrieve items from a specific row and column. For example:  

```javascript
board[0][0];
"X"

board[2][1];
"O"

board[2][0];
undefined
```

I constructed several small functions that wrap this square bracket notation to return particular parts of the board using row/column references that start from 1 (as opposed to 0, like array notation). For example:

```javascript
getSquare(1,1);
"X"

getRow(3);
[undefined, "O", undefined]

getCol(1);
["X", undefined, undefined]
```

The remaining logic is built on these basic functions to retrieve, set and compare parts of the board.

## Problems Encountered

- Rendering a grid of any size - individual div heights/widths needed to be calculated based on the current width of the browser window.
- Placing restrictions on turn-taking, over-riding previous moves, making moves after the game finishes, etc.
- Updating the board - when to redraw the entire game, when to update an individual square, etc.
- Displaying win styling for a specific line of squares.

___

Play the Game: https://github.com/hughfm/wdi-project-1
