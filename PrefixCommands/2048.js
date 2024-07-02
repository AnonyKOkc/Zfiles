const Gamecord = require("discord-gamecord");

module.exports = {
  name: "2048",
  description: "2048.",
  cooldown: 3000,
  run: async (client, message, args) => {
    const game = new Gamecord.TwoZeroFourEight({
        message: message,
        isSlashGame: false,
        embed: {
          title: '2048',
          color: '#5865F2'
        },
        emojis: {
          up: '⬆️',
          down: '⬇️',
          left: '⬅️',
          right: '➡️',
        },
        timeoutTime: 60000,
        buttonStyle: 'PRIMARY',
        playerOnlyMessage: 'Only {player} can use these buttons.'
      });
    await game.startGame();

    game.on("gameOver", (result) => {
      message.channel.send(result);
    });
  },
};
