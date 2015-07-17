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

};

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
    return game.getSquare(row, col) === null || game.getSquare(row, col) === undefined;
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

  setSquare : function (row, col, playerIndex) {
    game.board[row - 1][col - 1] = playerIndex;
    return playerIndex;
  }, // setSquare

  renderBoard : function () {
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

  checkSquareForWins : function (row, col) {
    if ( Util.allEqual(game.getRow(row)) ) {
      return game.getRefs('row', row);
    }

    if ( Util.allEqual(game.getCol(col)) ) {
      return game.getRefs('col', col);
    }

    if (row === col) {
      if ( Util.allEqual(game.getDiag('right')) ) {
        return game.getRefs('diag', 'right');
      }
    }

    if (row + col === game.board.length + 1) {
      if ( Util.allEqual(game.getDiag('left')) ) {
        return game.getRefs('diag', 'left');
      }
    }
    return false;
  }, // checkSquareForWins

  checkBoardForWins : function () {
    for (var row = 1; row <= game.board.length; row++) {
      if (Util.allEqual(game.getRow(row))) {
        return game.getRefs('row', row);
      }
    }

    for (var col = 1; col <= game.board.length; col++) {
      if (Util.allEqual(game.getCol(col))) {
        return game.getRefs('col', col);
      }
    }

    if (Util.allEqual(game.getDiag('right'))) {
      return game.getRefs('diag', 'right');
    }

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
