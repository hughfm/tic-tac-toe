// Utility Functions

var Util = {};

Util.allEqual = function (line) {
  // take any line of squares and return the player, if a win, or false if no win
  for (var i = 1; i < line.length; i++) {
    if (line[i] !== line[0] || typeof line[i] === undefined || line[i] === null) {
      return false;
    }
  }
  return true;
}; // allEqual

Util.hash = function(string) {
  return MD5(string.trim().toLowerCase());
};

Util.testSetup = function () {
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
}; // testSetup

Util.imageTag = function(player, size) {
  size = size || 200;

  var url = 'http://www.gravatar.com/avatar/' + Util.hash(game.players[player].email) + '?s=' + size + '&r=pg';
  return $('<img>').attr({
    src: url,
    alt: 'Player Image',
    class: 'player-image'
  });
}; // imageTag
