const Gamecord = require("discord-gamecord");

module.exports = {
  name: "rock-paper-scissors",
  description: "Challenge your memory with this game.",
  cooldown: 3000,
  run: async (client, message, args) => {
    const game = new Gamecord.RockPaperScissors({
        message: message,
        isSlashGame: false,
        opponent: message.mentions.users.first(),
        embed: {
          title: 'Rock Paper Scissors',
          color: '#5865F2',
          description: 'Press a button below to make a choice.'
        },
        buttons: {
          rock: 'Rock',
          paper: 'Paper',
          scissors: 'Scissors'
        },
        emojis: {
          rock: '🌑',
          paper: '📰',
          scissors: '✂️'
        },
        mentionUser: true,
        timeoutTime: 60000,
        buttonStyle: 'PRIMARY',
        pickMessage: 'You choose {emoji}.',
        winMessage: '**{player}** won the Game! Congratulations!',
        tieMessage: 'The Game tied! No one won the Game!',
        timeoutMessage: 'The Game went unfinished! No one won the Game!',
        playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
      });
    await game.startGame();

    game.on("gameOver", (result) => {
      message.channel.send(result);
    });
  },
};
