$( document ).ready(function() {
  // DOM manipulation in here.

  var gameInterface = {
    draw : function () {
      var squareSize = parseInt($('#board-wrapper').css('width'), 10) / game.board.length + 'px';
      var backgroundColours = ['lightgray', 'darkgray'];

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
          return $( this ).data('row') % 2 === 0;
        }), function (square, index) {
          $( square ).css( 'background-color', backgroundColours.slice().reverse()[index % 2] );
        }); // each square on even numbered rows

        _.each($('.square').filter(function () {
          return $( this ).data('row') % 2 !== 0;
        }), function (square, index) {
          $( square ).css( 'background-color', backgroundColours[index % 2] );
        }); // each square on odd numbered rows
      }

      // create players list
      var playersList = $('<ul>');
      _.each(game.players, function(player) {
        playersList.append($('<li>').html(player));
      });
      $('#players').html(playersList.html());

      gameInterface.updateTurn();
    },

    updateSquare : function(row, col) {
      $('.square').filter(function() {
        return parseInt($( this ).data('row'), 10) === row && parseInt($( this ).data('col'), 10) === col;
      }).html(game.players[game.getSquare(row, col)]).attr('data-value', game.getSquare(row, col));
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

    updateWinLine : function (winStatus) {
      _.each(winStatus, function(square) {
        var selector = '.square[data-row="';
        selector += square[0] + '"][data-col="' + square[1] + '"]';
        $(selector).css( {
          'background-color': 'gold',
          color: 'white'
        } );
      });
    },

    clickSquare : function(row, col, playerIndex) {
      // console.log(row, col);
      debugger;
      if (game.squareAvailable(row, col) && game.active) { // check if square is already taken & game is active
        // set and update square
        game.setSquare(row, col, playerIndex);
        gameInterface.updateSquare(row, col);

        var winStatus = game.checkSquareForWins(row, col);
        if (winStatus) { // check if player has won
          game.active = false;
          gameInterface.updateWinLine(winStatus);
          game.saveLocal();
          return;
        }

        // move on to next player
        game.nextPlayer();
        gameInterface.updateTurn();
        game.saveLocal();
      }

    },

    bindSquareClick : function () {
      $('#game-board').on('click', '.square', function() {
        // function to take a turn by clicking on a square
        var row = parseInt($( this ).data('row'), 10);
        var col = parseInt($( this ).data('col'), 10);

        gameInterface.clickSquare(row, col, game.turn);
      });
    },

    init : function (size, players) {
      game.createBoard(size); // create board
      game.players = players; // set players array
      // game.players.push('#');
      game.turn = 0; // set turn to first player
      // game.testSetup();
      gameInterface.draw(); // draw board on screen

      gameInterface.bindSquareClick();
      game.active = true; // start the game!
    },

    load : function () {
      if (!window.localStorage.getItem('board')) {
        gameInterface.init(4, ['C', 'H', 'X']); // initialize first game
      } else {
        game.loadLocal();
        gameInterface.draw();

        var winStatus = game.checkBoardForWins();
        if (winStatus) {
          gameInterface.updateWinLine(winStatus);
        }

        gameInterface.bindSquareClick();
      }

      $('#new-game').on('click', function() {
        // function to start a new game
        gameInterface.init(4, ['A', 'B']);
        game.saveLocal();
      });

      $('#setup-button').on('click', function() {
        $('#board-wrapper').toggle();
        $('#game-setup').toggle();
        $(this).html( ($(this).html() === 'Setup') ? 'Play' : 'Setup' );
      });
    }

  };

  gameInterface.load();

}); // document ready
