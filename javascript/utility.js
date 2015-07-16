// Utility Functions

var Util = {};

Util.allEqual = function (line) {
  // take any line of squares and return the player, if a win, or false if no win
  for (var i = 1; i < line.length; i++) {
    if (line[i] !== line[0] || (typeof line[i]) === "undefined" || line[i] === null) {
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

Util.imageTag = function(playerIndex, size) {
  size = size || 200;
  var email = game.players[playerIndex].email;
  var url = 'http://www.gravatar.com/avatar/';
  url += Util.hash(email) + '?s=' + size + '&r=pg';

  return $('<img>').attr({
    src: url,
    alt: 'Player Image',
    class: 'player-image'
  }).css('border', '5px solid ' + game.players[playerIndex].colour);
}; // imageTag

Util.playerTag = function(playerIndex) {
  var element = $('<div>').addClass('player clearfix').html(
    Util.imageTag(playerIndex, 100)
  ).attr({
    'data-player-index': playerIndex
  });

  // Name label and input
  var nameArea = $('<div class="input-area">');
  element.append(nameArea);

  nameArea.append($('<label>').attr({
    for: "player-" + playerIndex + "-name"
  }).html("Name:"));

  nameArea.append($('<input>').attr({
    type: "text",
    name: "player-" + playerIndex + "-name",
    id: "player-" + playerIndex + "-name",
    class: "player-name-input",
    value: game.players[playerIndex].name
  }));

  // Email label and input
  var emailArea = $('<div class="input-area">');
  element.append(emailArea);

  emailArea.append($('<label>').attr({
    for: "player-" + playerIndex + "-email"
  }).html("Email:"));

  emailArea.append($('<input>').attr({
    type: "text",
    name: "player-" + playerIndex + "-email",
    id: "player-" + playerIndex + "-email",
    class: "player-email-input",
    value: game.players[playerIndex].email
  }));

  // Change colour button
  element.append($('<button>').attr({
    type: "button",
    class: "change-colour-button"
  }).html("Change Colour"));


  // Remove button
  element.append($('<button>').attr({
    type: "button",
    class: "remove-player-button"
  }).html("Remove"));

  return element;
}; // playerTag

Util.randomRGB = function () {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);

  return "rgb(" + r + ", " + g + ", " + b + ")";
}; // randomRGB
