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

  setBoard : function (size) {
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
    // Set up the board as follows:
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

  setSquare : function (row, col, player) {
    game.board[row - 1][col - 1] = player;
    return player;
  }, // setSquare

  renderBoard : function () {
    var board = $('<div id="game-board" class="clearfix">');

    _.each(game.board, function(row, rowIndex) {
      _.each(row, function(square, colIndex) {
        board.append($('<div>').attr({
          row: rowIndex + 1,
          col: colIndex + 1,
          class: 'square'
        }).html(game.board[rowIndex][colIndex]));
      }); //each square
    }); // each row

    return board;
  }, // renderBoard

  checkWin : function (line) {
    // take any line of squares and return the player, if a win, or false if no win
    for (var i = 1; i < line.length; i++) {
      if (line[i] !== line[0] || !line[i]) {
        return false;
      }
    }
    return true;
  }, // checkWin

  checkAllWins : function (row, col) {
    var winLine = [];

    if ( game.checkWin(game.getRow(row)) ) {
      for (var i = 0; i < game.board.length; i++) {
        winLine.push([row, i + 1]);
      }
      return winLine;
    }

    if ( game.checkWin(game.getCol(col)) ) {
      for (var i = 0; i < game.board.length; i++) {
        winLine.push([i + 1, col]);
      }
      return winLine;
    }

    if (row === col) {
      if ( game.checkWin(game.getDiag('right')) ) {
        for (var i = 0; i < game.board.length; i++) {
          winLine.push([i + 1, i + 1]);
        }
        return winLine;
      }
    }

    if (row + col === game.board.length + 1) {
      if ( game.checkWin(game.getDiag('left')) ) {
        for (var i = 0; i < game.board.length; i++) {
          winLine.push([i + 1, game.board.length - i]);
        }
        return winLine;
      }
    }

    return false;
  } // checkAllWins
}; //game object


$( document ).ready(function() {
  // DOM manipulation in here.

  var gameInterface = {
    draw : function () {
      var squareSize = parseInt($('#board-wrapper').css('width'), 10) / game.board.length + 'px';
      var backgroundColours = ['lightgray', 'darkgray'];

      // console.log(boardWrapper, board);

      $('#board-wrapper').html(game.renderBoard);

      $('#game-board').children().css({
        width: squareSize,
        height: squareSize,
        'line-height': squareSize
      });

      if (game.board.length % 2 !== 0) {
        _.each($('.square'), function(square, index) {
          $( square ).css( 'background-color', backgroundColours[index % 2] );
        });
      } else {
        _.each($('.square').filter(function () {
          return $( this ).attr('row') % 2 === 0;
        }), function (square, index) {
          $( square ).css( 'background-color', backgroundColours.slice().reverse()[index % 2] );
        }); // each square on even numbered rows

        _.each($('.square').filter(function () {
          return $( this ).attr('row') % 2 !== 0;
        }), function (square, index) {
          $( square ).css( 'background-color', backgroundColours[index % 2] );
        }); // each square on odd numbered rows
      }

      // update players list
      var playersList = $('<ul>');
      _.each(game.players, function(player) {
        playersList.append($('<li>').html(player));
      });
      $('#players').html(playersList.html());

      gameInterface.updateTurn();
    },

    updateSquare : function(row, col) {
      $('#game-board').children().filter(function() {
        return parseInt($( this ).attr('row'), 10) === row && parseInt($( this ).attr('col'), 10) === col;
      }).html(game.getSquare(row, col));
    },

    updateTurn : function() {
      // update current turn
      $('#players li').css( {
        'background-color': '',
        color: 'white'
      } );

      $('#players li').eq(game.turn).css( {
        'background-color': 'lightblue',
        color: 'black'
      } );
    },

    clickSquare : function(row, col, player) {
      // console.log(row, col);
      if (game.squareAvailable(row, col) && game.active) { // check if square is already taken & game is active
        // set and update square
        game.setSquare(row, col, player);
        gameInterface.updateSquare(row, col);

        var winStatus = game.checkAllWins(row, col);
        if (winStatus) { // check if player has won
          game.active = false;
          _.each(winStatus, function(square) {
            $('.square[row="' + square[0] + '"][col="' + square[1] + '"]').css( {
              'background-color': 'gold',
              color: 'white'
            } );
          });
          return;
        }

        // move on to next player
        game.nextPlayer();
        gameInterface.updateTurn();
      }

    },

    init : function (size, players) {
      game.setBoard(size); // create board
      game.players = players; // set players array
      // game.players.push('#');
      game.turn = 0; // set turn to first player
      // game.testSetup();
      gameInterface.draw(); // draw board on screen

      $('#game-board').on('click', '.square', function() {
        // function to take a turn by clicking on a square
        var row = parseInt($( this ).attr('row'), 10);
        var col = parseInt($( this ).attr('col'), 10);

        gameInterface.clickSquare(row, col, game.players[game.turn]);
      });

      game.active = true; // start the game!
    }

  };

  gameInterface.init(5, ['o', 'x']);

  // $('.square').filter(function(){
  //   var row = parseInt($(this).attr('row'), 10);
  //   var col = parseInt($(this).attr('col'), 10);
  //
  //   return (row === col) || (row + col === game.board.length + 1);
  // }).css('background-color', 'gold');

}); // document ready
