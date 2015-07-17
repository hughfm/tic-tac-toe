// Noughts & Crosses Game
var gameDefaults = {
  players : [ {
    name: "Noughts",
    email: "hughfmiddleton+noughts@gmail.com",
    colour: Util.randomRGB()
  },
  {
    name: "Crosses",
    email: "hughfmiddleton+crosses@gmail.com",
    colour: Util.randomRGB()
  } ],

  heading : "TIC TAC TOE"
}; // gameDefaults object

var game = {

  // the game board is a 2-dimensional nested array structure with equal dimensions
  // [ [ _ , _ , _ ],
  //   [ _ , _ , _ ],
  //   [ _ , _ , _ ] ]
  // thus, game.board[i] returns the ith row as an array
  // game.board[i][j] returns the element in the jth column of the ith row

  board : [],
  players : JSON.parse(JSON.stringify(gameDefaults.players)),
  turn : 0,
  active : false,

  nextPlayer : function () {
    if (game.turn >= game.players.length - 1) {
      game.turn = 0;
    } else {
      game.turn ++;
    }
  }, // nextPlayer

  createBoard : function (size) {
    // creates empty board of specified size (square values are undefined)
    game.board = [];

    for (var i = 0; i < size; i++) {
      game.board[i] = Array(size);
    }
  }, // createBoard

  getRow : function(row) {
    // return specified row as an array where rows begin at 1.
    return game.board[row - 1];
  }, // getRow

  getCol : function (col) {
    // return specified column as an array where columns begin at 1.

    // return undefined if an invalid column is passed - this is also how getRow behaves
    if (col < 0 || col > game.board.length) {
      return;
    }

    var colArray = [];

    _.each(game.board, function(row, rowIndex) {
      colArray[rowIndex] = row[col - 1];
    }); // each row

    return colArray;
  }, // getCol

  getSquare : function (row, col) {
    // return specified element, where row and col both start at 1.
    return game.board[row - 1][col - 1];
  }, // getSquare

  squareAvailable : function (row, col) {
    return game.getSquare(row, col) === null || game.getSquare(row, col) === undefined;
  }, // squareAvailable

  getDiag : function (direction) {
    // return diagonal starting at the top, as an array
    // can specify direction of diagonal: 'left' or 'right'

    // return undefined if invalid direction is passed
    if (direction !== 'left' && direction !== 'right') {
      return;
    }

    var diagArray = [];
    var column;

    if (direction === 'right') {
      column = 0;
      _.each(game.board, function(row, rowIndex) {
        diagArray[rowIndex] = row[column];
        column ++;
      }); // each row
    } else if (direction === 'left') {
      column = game.board.length - 1;
      _.each(game.board, function(row, rowIndex) {
        diagArray[rowIndex] = row[column];
        column --;
      }); // each row
    }

    return diagArray;
  }, // getDiag

  setSquare : function (row, col, playerIndex) {
    // return undefined if an invalid playerIndex is passed
    if (playerIndex < 0 || playerIndex > (game.players.length - 1)) {
      return;
    }

    game.board[row - 1][col - 1] = playerIndex;

    return playerIndex;
  }, // setSquare

  renderBoardHTML : function () {
    var board = $('<div id="game-board" class="clearfix">');
    var squareContent;

    _.each(game.board, function(row, rowIndex) {
      _.each(row, function(square, colIndex) {
        if ((typeof game.board[rowIndex][colIndex]) === "number") {
          squareContent = Util.imageTag(game.board[rowIndex][colIndex]).addClass('board-piece');
        } else {
          squareContent = null;
        }

        board.append($('<div>').attr({
          'data-row': rowIndex + 1,
          'data-col': colIndex + 1,
          'data-value': game.board[rowIndex][colIndex]
        }).addClass('square').html(squareContent));
      }); //each square
    }); // each row

    return board;
  }, // renderBoardHTML

  getRefs : function (direction, reference) {
    // function takes a direction and a reference, and returns an array of
    // coordinates of a whole line for the purposes of manipulating DOM elements
    // for example, on a 3x3 board, getRefs('row', 1) should return [ [1,1], [1,2], [1,3] ]

    var refs = [];

    if (direction === 'row') {
      for (var col = 1; col <= game.board.length; col++) {
        refs.push([reference, col]);
      }
      return refs;
    } else if (direction === 'col') {
      for (var row = 1; row <= game.board.length; row++) {
        refs.push([row, reference]);
      }
      return refs;
    } else if (direction === 'diag') {
      if (reference === 'left') {
        for (var diagRow = 1; diagRow <= game.board.length; diagRow++) {
          refs.push([diagRow, game.board.length - diagRow + 1]);
        }
        return refs;
      } else if (reference === 'right') {
        for (var rowCol = 1; rowCol <= game.board.length; rowCol++) {
          refs.push([rowCol, rowCol]);
        }

        return refs;
      }
    }

    // if an invalid direction is passed, an empty array will be returned.
    return refs;
  }, // getRefs

  checkSquareForWins : function (row, col) {
    // function checks a specific square for any wins associated with it
    // returns coordinates of the win line, or false

    // Check the row that the square is in
    if ( Util.allEqual(game.getRow(row)) ) {
      return game.getRefs('row', row);
    }

    // Check the columm that the square is in
    if ( Util.allEqual(game.getCol(col)) ) {
      return game.getRefs('col', col);
    }

    // If the square is in the 'right' diagonal, check that line
    if (row === col) {
      if ( Util.allEqual(game.getDiag('right')) ) {
        return game.getRefs('diag', 'right');
      }
    }

    // If the square is in the 'left' diagonal, check that line
    if (row + col === game.board.length + 1) {
      if ( Util.allEqual(game.getDiag('left')) ) {
        return game.getRefs('diag', 'left');
      }
    }

    // return false if no wins found
    return false;
  }, // checkSquareForWins

  checkBoardForWins : function () {
    // function checks the whole board for wins
    // returns coordinates of the win line, or false

    // check all rows
    for (var row = 1; row <= game.board.length; row++) {
      if (Util.allEqual(game.getRow(row))) {
        return game.getRefs('row', row);
      }
    }

    // check all columns
    for (var col = 1; col <= game.board.length; col++) {
      if (Util.allEqual(game.getCol(col))) {
        return game.getRefs('col', col);
      }
    }

    // check right diagonal
    if (Util.allEqual(game.getDiag('right'))) {
      return game.getRefs('diag', 'right');
    }

    // check left diagonal
    if (Util.allEqual(game.getDiag('left'))) {
      return game.getRefs('diag', 'left');
    }

    return false;
  }, // checkBoardForWins

  saveLocal : function () {
    var boardJSON = JSON.stringify(game.board);
    var playersJSON = JSON.stringify(game.players);
    var turnJSON = JSON.stringify(game.turn);
    var activeJSON = JSON.stringify(game.active);

    window.localStorage.setItem('board', boardJSON);
    window.localStorage.setItem('players', playersJSON);
    window.localStorage.setItem('turn', turnJSON);
    window.localStorage.setItem('active', activeJSON);
  }, // saveLocal

  loadLocal : function () {
    var boardJSON = window.localStorage.getItem('board');
    var playersJSON = window.localStorage.getItem('players');
    var turnJSON = window.localStorage.getItem('turn');
    var activeJSON = window.localStorage.getItem('active');

    game.board = JSON.parse(boardJSON);
    game.players = JSON.parse(playersJSON);
    game.turn = JSON.parse(turnJSON);
    game.active = JSON.parse(activeJSON);
  } // loadLocal

}; //game object
