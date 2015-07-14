// Noughts & Crosses Game

var game = {

  // the game board is a 2-dimensional nested array structure with equal dimensions
  // [ [ _ , _ , _ ],
  //   [ _ , _ , _ ],
  //   [ _ , _ , _ ] ]
  // thus, game.board[i] returns the ith row as an array
  // game.board[i][j] returns the element in the jth column of the ith row

  board : [],

  setBoard : function (size) {
    // creates empty board of specified size
    game.board = [];

    for (var i = 0; i < size; i++) {
      game.board[i] = Array(size);
    }
  },

  getRow : function(row) {
    // return specified row as an array where rows begin at 1.
    return game.board[row - 1];
  },

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
  },

  getEl : function (row, col) {
    // return specified element, where row and col both start at 1.
    return game.board[row - 1][col - 1];
  },

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
  },

  testSetup : function () {
    // Set up the board as follows:
    //           0:  1:  2:  3:  4:
    //   0: [ [  1,  2,  3,  4,  5 ],
    //   1:   [  6,  7,  8,  9, 10 ],
    //   2:   [ 11, 12, 13, 14, 15 ],
    //   3:   [ 16, 17, 18, 19, 20 ],
    //   4:   [ 21, 22, 23, 24, 25 ] ]

    var counter = 1;

    _.each(game.board, function(row, i) {
      _.each(row, function(element, j) {
        game.board[i][j] = counter;
        counter ++;
      }); // each element
    }); // each row
  },

  setSquare : function (row, col, player) {
    game.board[row - 1][col - 1] = player;
    return player;
  },
};


$( document ).ready(function() {
  // DOM manipulation in here.
  game.setBoard(5);
  // game.testSetup();

}); // document ready
