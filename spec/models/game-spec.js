describe("Model::Game", function() {
  var game, player;

  beforeEach(function() {
    game = new window.Models.Game({ gameTypeId : 'risk2210', numYears : 5 });
    player = new window.Models.Player({ name : 'Cory' });
    window.collections.players.add(player);
  });

  describe("initialize() - setup the model", function() {
    it("should require the gameType and numYears", function() {
      expect(function(){ new window.Models.Game() } ).toThrow('gameTypeId is required.');
      expect(function(){ new window.Models.Game({ gameTypeId : 'blah' }) } ).toThrow('numYears is required.');
    });

    it("should validate the gameType and numYears", function() {
      expect(function(){ new window.Models.Game({ gameTypeId : 'blah', numYears : 5 }) } ).toThrow('Game type not found.');
      expect(function(){ new window.Models.Game({ gameTypeId : 'risk2210', numYears : 0 }) } ).toThrow('0 must be between 2 and 99');
      expect(function(){ new window.Models.Game({ gameTypeId : 'risk2210', numYears : 100 }) } ).toThrow('100 must be between 2 and 99');
    });

    it("should link to the gameType data model", function() {
      expect( exists(game._gameType) ).toEqual(true);
      expect( game._gameType ).toEqual(jasmine.any(Object));
    });

    it("should create the gamePlayers collection", function() {
      expect( exists(game._gamePlayers) ).toEqual(true);
      expect( game._gamePlayers ).toEqual(jasmine.any(Object));
    });
  });

  describe(".addPlayer(player, color) - add a player to the game", function() {
    it("should error when player is not found", function() {
      expect(function(){ game.addPlayer({}) } ).toThrow('Player not found.');
      expect(function(){ game.addPlayer('123') } ).toThrow('Player not found.');
    });

    it("should error when color is not found or invalid", function() {
      expect(function(){ game.addPlayer(player) } ).toThrow('color is required.');
      expect(function(){ game.addPlayer(player, 'blah') } ).toThrow('blah must be one of [red,black,gold,blue,green].');
    });

    it("should add the player by id", function() {
      game.addPlayer( player.get('id'), 'red' );
      expect(game._gamePlayers.length).toEqual(1);
      expect(game._gamePlayers.at(0).get('playerId')).toEqual(player.get('id'));
      expect(game._gamePlayers.at(0).get('color')).toEqual('red');
    });

    it("should add the player by model", function() {
      game.addPlayer( player, 'red' );
      expect(game._gamePlayers.length).toEqual(1);
      expect(game._gamePlayers.at(0).get('playerId')).toEqual(player.get('id'));
    });

    it("should error when trying to add more than max players", function() {
      for(var x = 1; x<=5; x++) {
        var test = new window.Models.Player({ name : 'Test' });
        window.collections.players.add(test);
        game.addPlayer( test, 'red' );
      }
      expect(game._gamePlayers.length).toEqual(5);
      var num5 = new window.Models.Player({ name : 'Test' });
      window.collections.players.add(num5);
      expect( function(){ game.addPlayer( num5, 'red' ) } ).toThrow('Already at max of 5 players.');
      expect(game._gamePlayers.length).toEqual(5);
    });
  });

  describe(".removePlayer(player) - should remove a player from the game", function() {
    beforeEach(function() {
      game.addPlayer( player , 'red');
    });

    it("should error when player is not found", function() {
      expect(function(){ game.removePlayer({}) } ).toThrow('Player not found in game.');
      expect(function(){ game.removePlayer('123') } ).toThrow('Player not found in game.');
    });

    it("should remove the player by id", function() {
      game.removePlayer( player.get('id') );
      expect(game._gamePlayers.length).toEqual(0);
    });

    it("should remove the player by model", function() {
      game.removePlayer( player );
      expect(game._gamePlayers.length).toEqual(0);
    });
  });

});