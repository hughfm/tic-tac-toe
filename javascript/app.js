// Noughts & Crosses Game

var game = {

  // the game board is a 2-dimensional nested array structure with equal dimensions
  // [ [ _ , _ , _ ],
  //   [ _ , _ , _ ],
  //   [ _ , _ , _ ] ]
  // thus, game.board[i] returns the ith row as an array
  // game.board[i][j] returns the element in the jth column of the ith row

  board : [],
  players : [],
  turn : 0,
  active : false,

  nextPlayer : function () {
    if (game.turn >= game.players.length - 1) {
      game.turn = 0;
    } else {
      game.turn ++;
    }
  },

  createBoard : function (size) {
    // creates empty board of specified size
    game.board = [];

    for (var i = 0; i < size; i++) {
      game.board[i] = Array(size);
    }
  }, // setBoard

  getRow : function(row) {
    // return specified row as an array where rows begin at 1.
    return game.board[row - 1];
  }, // getRow

  getCol : function (col) {
    // return specified column as an array where columns begin at 1.
    if (col > game.board.length) {
      return;
    }

    var colArray = [];

    _.each(game.board, function(row, i) {
      colArray[i] = row[col - 1];
    }); // each row

    return colArray;
  }, // getCol

  getSquare : function (row, col) {
    // return specified element, where row and col both start at 1.
    return game.board[row - 1][col - 1];
  }, // getSquare

  squareAvailable : function (row, col) {
    return !game.getSquare(row, col);
  }, // squareAvailable

  getDiag : function (origin) {
    // return diagonal starting at the top, as an array
    // can specify direction of diagonal: 'left' or 'right'
    if (origin !== 'left' && origin !== 'right') {
      return;
    }

    var diagArray = [];
    var column;

    if (origin === 'right') {
      column = 0;
      _.each(game.board, function(row, i) {
        diagArray[i] = row[column];
        column ++;
      }); // each row
    } else if (origin === 'left') {
      column = game.board.length - 1;
      _.each(game.board, function(row, i) {
        diagArray[i] = row[column];
        column --;
      }); // each row
    }

    return diagArray;
  }, // getDiag

  testSetup : function () {
    // Set up the board as follows for testing purposes:
    //           0:  1:  2:  3:  4:
    //   0: [ [  1,  2,  3,  4,  5 ],
    //   1:   [  6,  7,  8,  9, 10 ],
    //   2:   [ 11, 12, 13, 14, 15 ],
    //   3:   [ 16, 17, 18, 19, 20 ],
    //   4:   [ 21, 22, 23, 24, 25 ] ]

    var counter = 1;

    _.each(game.board, function(row, i) {
      _.each(row, function(square, j) {
        game.board[i][j] = counter;
        counter ++;
      }); // each element
    }); // each row
  }, // testSetup

  setSquare : function (row, col, playerIndex) {
    game.board[row - 1][col - 1] = playerIndex;
    return playerIndex;
  }, // setSquare

  renderBoard : function () {
    var board = $('<div id="game-board" class="clearfix">');

    _.each(game.board, function(row, rowIndex) {
      _.each(row, function(square, colIndex) {
        board.append($('<div>').attr({
          'data-row': rowIndex + 1,
          'data-col': colIndex + 1,
          'data-value': ''
        }).addClass('square').html(game.players[game.board[rowIndex][colIndex]]));
      }); //each square
    }); // each row

    return board;
  }, // renderBoard

  getRefs : function (direction, reference) {
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

    return refs;
  }, // getRefs

  allEqual : function (line) {
    // take any line of squares and return the player, if a win, or false if no win
    for (var i = 1; i < line.length; i++) {
      if (line[i] !== line[0] || typeof line[i] === undefined || line[i] === null) {
        return false;
      }
    }
    return true;
  }, // allEqual

  checkSquareForWins : function (row, col) {
    if ( game.allEqual(game.getRow(row)) ) {
      return game.getRefs('row', row);
    }

    if ( game.allEqual(game.getCol(col)) ) {
      return game.getRefs('col', col);
    }

    if (row === col) {
      if ( game.allEqual(game.getDiag('right')) ) {
        return game.getRefs('diag', 'right');
      }
    }

    if (row + col === game.board.length + 1) {
      if ( game.allEqual(game.getDiag('left')) ) {
        return game.getRefs('diag', 'left');
      }
    }
    return false;
  }, // checkSquareForWins

  checkBoardForWins : function () {
    for (var row = 1; row <= game.board.length; row++) {
      if (game.allEqual(game.getRow(row))) {
        return game.getRefs('row', row);
      }
    }

    for (var col = 1; col <= game.board.length; col++) {
      if (game.allEqual(game.getCol(col))) {
        return game.getRefs('col', col);
      }
    }

    if (game.allEqual(game.getDiag('right'))) {
      return game.getRefs('diag', 'right');
    }

    if (game.allEqual(game.getDiag('left'))) {
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
  },

  loadLocal : function () {
    var boardJSON = window.localStorage.getItem('board');
    var playersJSON = window.localStorage.getItem('players');
    var turnJSON = window.localStorage.getItem('turn');
    var activeJSON = window.localStorage.getItem('active');

    game.board = JSON.parse(boardJSON);
    game.players = JSON.parse(playersJSON);
    game.turn = JSON.parse(turnJSON);
    game.active = JSON.parse(activeJSON);
  }
}; //game object
