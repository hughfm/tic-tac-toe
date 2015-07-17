$( document ).ready(function() {
  // DOM manipulation in here.

  var gameInterface = {
    boardWrapper : $('#board-wrapper'),
    gameSetup : $('#game-setup'),
    mainHeading : $('#main-heading'),
    boardSizeSelect : $('#board-size'),

    drawBoard : function () {
      // draws the current state of the board on the screen

      var squareSize = parseInt(gameInterface.boardWrapper.css('width'), 10) / game.board.length + 'px';
      var backgroundColours = ['lightgray', 'darkgray'];

      gameInterface.boardWrapper.html(game.renderBoardHTML);

      // set correct dimensions of every square
      $('#game-board').children().css({
        'width': squareSize,
        'height': squareSize,
      });

      // set background colours for checkerboard effect
      if (game.board.length % 2 !== 0) {
        // boards of odd-numbered dimensions are easy...
        _.each($('.square'), function(square, index) {
          $( square ).css( 'background-color', backgroundColours[index % 2] );
        });
      } else {
        // boards with even-numbered dimensions slightly harder...
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
    },

    updatePlayerList : function() {
      // updates the list of players in the info panel at the bottom of the screen
      var playersList = $('<ul>');
      var playerListItem;

      _.each(game.players, function(player, playerIndex) {
        playerListItem = $('<li>').html(
          Util.imageTag(playerIndex, 50)
        ).addClass('player-list').append($('<p>').html(player.name).addClass('player-name'));
        playersList.append(playerListItem);
      });

      $('#players').html(playersList.html());

      gameInterface.displayTurn();
    },

    displayTurn : function() {
      // display the current turn in the player list
      $('#players li').css( {
        'background-color': '',
        color: 'white'
      } );

      $('#players li').eq(game.turn).css( {
        'background-color': 'white',
        color: 'black'
      } );
    },

    updateSquare : function(row, col) {
      // updates given square to the current state in game.board

      $('.square').filter(function() {
        return parseInt($( this ).data('row'), 10) === row && parseInt($( this ).data('col'), 10) === col;
      }).html(
        Util.imageTag(game.getSquare(row, col)).addClass('board-piece')
      ).attr('data-value', game.getSquare(row, col));
    },

    updateWinLine : function (line) {
      // changes all background colours in the given line
      _.each(line, function(square) {
        var selector = '.square[data-row="';
        selector += square[0] + '"][data-col="' + square[1] + '"]';
        $(selector).css( {
          'background-color': 'gold',
          'color': 'white'
        } );
      });
    },

    clickSquare : function(row, col, playerIndex) {
      // function to handle clicking on a square

      if (game.squareAvailable(row, col) && game.active) {
        // check that square is available & game is active

        // set square and update the UI
        game.setSquare(row, col, playerIndex);
        gameInterface.updateSquare(row, col);

        // check for wins and update if necessary
        var winStatus = game.checkSquareForWins(row, col);
        if (winStatus) {
        // check if player has won
          game.active = false; // end game
          gameInterface.updateWinLine(winStatus); // display win line
          $('#main-heading').html(game.players[game.turn].name + " WINS!"); // update heading
        } else {
          game.nextPlayer(); // move on to next player
          gameInterface.displayTurn(); // update turn display
        }

        game.saveLocal(); // save the game
      }

    },

    addPlayersToSetup : function() {
      // populate player setup area
      _.each(game.players, function(player, playerIndex) {
        gameInterface.gameSetup.find('#add-player-button').before(
          Util.playerTag(playerIndex)
        );
      });
    },

    init : function (size, players) {
      // game initializer
      // both arguments are optional - size defaults to 3, passing a players array
      // updates the current player list

      size = size || 3; // set default size
      game.createBoard(size); // create board

      if (players) {
        game.players = players; // set players array
      }

      game.turn = 0; // set turn to first player
      gameInterface.drawBoard(); // draw board on screen
      gameInterface.updatePlayerList(); // update the players list
      gameInterface.mainHeading.html(gameDefaults.heading); // set default heading
      gameInterface.boardSizeSelect.val(size); // update the board size select box to reflect current size

      game.active = true; // start the game!
    },

    events : {
      squareClick : function () {
        gameInterface.boardWrapper.on('click', '.square', function() {
          // function to take a turn by clicking on a square
          var row = parseInt($( this ).data('row'), 10);
          var col = parseInt($( this ).data('col'), 10);

          gameInterface.clickSquare(row, col, game.turn);
        });
      },

      newGameClick : function () {
        $('#new-game-button').on('click', function() {
          gameInterface.init(parseInt($('#board-size').val(), 10));
          game.saveLocal();
        });
      },

      setupClick : function () {
        $('#setup-button').on('click', function() {
          gameInterface.boardWrapper.hide();
          $('#game-setup').show();
          $(this).hide();
          $('#reset-button').hide();
          $('#new-game-button').hide();
          $('#play-button').css('display', 'inline-block');
          $('#main-heading').html("GAME SETUP");
        });
      },

      playClick : function () {
        $('#play-button').on('click', function() {
          if (game.players.length === 0) {
            alert("You don't have any players!");
            return;
          }

          gameInterface.boardWrapper.show();
          $('#game-setup').hide();
          $(this).hide();
          $('#reset-button').css('display', 'inline-block');
          $('#new-game-button').css('display', 'inline-block');
          $('#setup-button').css('display', 'inline-block');

          if (parseInt($('#board-size').val(), 10) !== game.board.length) {
            gameInterface.init(parseInt($('#board-size').val(), 10));
            game.saveLocal();
          }

          gameInterface.drawBoard();
          gameInterface.updatePlayerList();


          var winStatus = game.checkBoardForWins();
          if (winStatus) {
            gameInterface.updateWinLine(winStatus);
            $('#main-heading').html(game.players[game.turn].name + " WINS!");
          } else {
            $('#main-heading').html(gameDefaults.heading);
          }

        }); // play
      },

      resetClick : function () {
        $('#reset-button').on('click', function() {
          window.localStorage.clear();
          gameInterface.init(null, JSON.parse(JSON.stringify(gameDefaults.players)));
          $('#player-setup .player').remove();
          gameInterface.addPlayersToSetup();
        });
      },

      addPlayer : function () {
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
      },

      removePlayer : function () {
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
      },

      changeColour : function () {
        // Change Colour Event Handler
        $('#player-setup').on('click', '.change-colour-button', function() {
          var playerIndex = $( this ).parent().attr('data-player-index');
          game.players[playerIndex].colour = Util.randomRGB();
          $(this).parent().replaceWith(Util.playerTag(playerIndex));
          game.saveLocal();
          gameInterface.updatePlayerList();
        });
      },

      changeName : function () {
        // Change name event Handler
        $('#player-setup').on('change', '.player-name-input', function() {
          var playerIndex = parseInt($( this ).closest('.player').attr('data-player-index'), 10);
          game.players[playerIndex].name = $( this ).val();
          game.saveLocal();
          gameInterface.updatePlayerList();
        });
      },

      changeEmail : function () {
        $('#player-setup').on('change', '.player-email-input', function() {
          var playerIndex = parseInt($( this ).closest('.player').attr('data-player-index'), 10);
          game.players[playerIndex].email = $( this ).val();
          $(this).parent().parent().replaceWith(Util.playerTag(playerIndex));
          game.saveLocal();
          gameInterface.updatePlayerList();
        });
      } // gameInterface.events.changeEmail

    }, // gameInterface.events

    load : function () {
      // function runs on initial load

      // populate board size select box
      _.each([3,4,5,6,7,8,9,10], function(size) {
        $('#game-setup #board-size').append(
          $('<option>').val(size).html(size + 'x' + size)
        );
      });

      // check if game is saved in localStorage
      if (!window.localStorage.getItem('board')) {
        gameInterface.init(); // initialize first game
      } else {
        game.loadLocal(); // load saved game
        gameInterface.drawBoard(); // draw board
        gameInterface.updatePlayerList(); // update players list

        // check whole board for wins
        var winStatus = game.checkBoardForWins();
        if (winStatus) {
          gameInterface.updateWinLine(winStatus); // display win on board
          gameInterface.mainHeading.html(game.players[game.turn].name + " WINS!");
        } else {
          gameInterface.mainHeading.html(gameDefaults.heading);
        }

        gameInterface.boardSizeSelect.val(game.board.length.toString());
      }

      gameInterface.addPlayersToSetup(); // add players to setup screen

      // bind events
      gameInterface.events.squareClick();
      gameInterface.events.newGameClick();
      gameInterface.events.setupClick();
      gameInterface.events.playClick();
      gameInterface.events.resetClick();
      gameInterface.events.addPlayer();
      gameInterface.events.removePlayer();
      gameInterface.events.changeColour();
      gameInterface.events.changeName();
      gameInterface.events.changeEmail();

    } // gameInterface.load

  }; // gameInterface

  gameInterface.load();

}); // document ready
