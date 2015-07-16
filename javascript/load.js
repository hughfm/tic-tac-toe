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

      gameInterface.updatePlayerList();
    },

    updatePlayerList : function() {
      // create players list
      var playersList = $('<ul>');
      var playerListItem;
      _.each(game.players, function(player, playerIndex) {
        playerListItem = $('<li>').html(
          Util.imageTag(playerIndex, 50)
        ).addClass('player-list').append($('<p>').html(player.name).addClass('player-name'));
        playersList.append(playerListItem);
      });

      $('#players').html(playersList.html());

      gameInterface.updateTurn();
    },

    updateSquare : function(row, col) {
      $('.square').filter(function() {
        return parseInt($( this ).data('row'), 10) === row && parseInt($( this ).data('col'), 10) === col;
      }).html(
        Util.imageTag(game.getSquare(row, col)).addClass('board-piece')
      ).attr('data-value', game.getSquare(row, col));
    },

    updateTurn : function() {
      // update current turn
      $('#players li').css( {
        'background-color': '',
        color: 'white'
      } );

      $('#players li').eq(game.turn).css( {
        'background-color': 'white',
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
      size = size || 3;
      game.createBoard(size); // create board

      if (players) {
        game.players = players; // set players array
      }

      // game.players.push('#');
      game.turn = 0; // set turn to first player
      // game.testSetup();
      gameInterface.draw(); // draw board on screen

      gameInterface.bindSquareClick();
      $('#board-size').val(size);
      game.active = true; // start the game!
    },

    addPlayersToSetup : function() {
      // populate player setup area
      _.each(game.players, function(player, playerIndex) {
        $('#game-setup #add-player-button').before(
          Util.playerTag(playerIndex)
        );
      });
    },

    load : function () {
      // populate board size select box
      _.each([3,4,5,6,7,8,9,10], function(size) {
        $('#game-setup #board-size').append(
          $('<option>').val(size).html(size + 'x' + size)
        );
      });

      if (!window.localStorage.getItem('board')) {
        gameInterface.init(); // initialize first game
      } else {
        game.loadLocal();
        gameInterface.draw();

        var winStatus = game.checkBoardForWins();
        if (winStatus) {
          gameInterface.updateWinLine(winStatus);
        }
        $('#board-size').val(game.board.length.toString());
        gameInterface.bindSquareClick();
      }

      gameInterface.addPlayersToSetup();

      // new game button
      $('#new-game-button').on('click', function() {
        gameInterface.init(parseInt($('#board-size').val(), 10));
        game.saveLocal();
      });

      // Setup Button
      $('#setup-button').on('click', function() {
        $('#board-wrapper').hide();
        $('#game-setup').show();
        $(this).hide();
        $('#reset-button').hide();
        $('#new-game-button').hide();
        $('#play-button').css('display', 'inline-block');
      });

      // Play Button
      $('#play-button').on('click', function() {
        if (game.players.length === 0) {
          alert("You don't have any players!");
          return;
        }

        $('#board-wrapper').show();
        $('#game-setup').hide();
        $(this).hide();
        $('#reset-button').css('display', 'inline-block');
        $('#new-game-button').css('display', 'inline-block');
        $('#setup-button').css('display', 'inline-block');

        if (parseInt($('#board-size').val(), 10) !== game.board.length) {
          gameInterface.init(parseInt($('#board-size').val(), 10));
          game.saveLocal();
        }

        gameInterface.draw();

        var winStatus = game.checkBoardForWins();
        if (winStatus) {
          gameInterface.updateWinLine(winStatus);
        }

        gameInterface.bindSquareClick();
      });

      // Reset Button
      $('#reset-button').on('click', function() {
        window.localStorage.clear();
        gameInterface.init(null, game.defaultPlayers);
        $('#player-setup .player').remove();
        gameInterface.addPlayersToSetup();
      });

      // Add Player Event Handler
      $('#add-player-button').on('click', function() {
        if (game.players.length < 5) {
          game.players.push({
            name: "Player",
            email: "",
            colour: Util.randomRGB()
          });
          $('#add-player-button').before(
            Util.playerTag(game.players.length - 1)
          );
          gameInterface.init(parseInt($('#board-size').val(), 10));
          gameInterface.updatePlayerList();
          game.saveLocal();
          if (game.players.length >= 5) {
            $(this).attr('disabled', true);
          }
        }
      });

      // Remove Player Event Handler
      $('#player-setup').on('click', '.remove-player-button', function() {
        var playerIndex = $( this ).parent().attr('data-player-index');
        game.players.splice(playerIndex, 1);
        $(this).parent().remove();
        gameInterface.init(parseInt($('#board-size').val(), 10));
        game.saveLocal();
        gameInterface.updatePlayerList();
        if (game.players.length < 5) {
          $('#add-player-button').attr('disabled', false);
        }
      });

      // Change Colour Event Handler
      $('#player-setup').on('click', '.change-colour-button', function() {
        var playerIndex = $( this ).parent().attr('data-player-index');
        game.players[playerIndex].colour = Util.randomRGB();
        $(this).parent().replaceWith(Util.playerTag(playerIndex));
        game.saveLocal();
        gameInterface.updatePlayerList();
      });

      // Change name event Handler
      $('#player-setup').on('change', '.player-name-input', function() {
        console.log(100);
        var playerIndex = $( this ).parent().attr('data-player-index');
        game.players[playerIndex].name = $( this ).val();
        game.saveLocal();
        gameInterface.updatePlayerList();
      });

      // Change email event Handler
      $('#player-setup').on('change', '.player-email-input', function() {
        var playerIndex = $( this ).parent().attr('data-player-index');
        game.players[playerIndex].email = $( this ).val();
        $(this).parent().replaceWith(Util.playerTag(playerIndex));
        game.saveLocal();
        gameInterface.updatePlayerList();
      });

    }

  };

  gameInterface.load();

}); // document ready
