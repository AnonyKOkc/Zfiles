const Gamecord = require("discord-gamecord");

module.exports = {
  name: "hangman",
  description: "Test your word skills in Hangman.",
  cooldown: 3000,
  run: async (client, message, args) => {
    const game = new Gamecord.Hangman({
      message: message,
      isSlashGame: false,
      embed: {
        title: "Hangman",
        color: "#5865F2",
      },
      hangman: {
        hat: "🎩",
        head: "😟",
        shirt: "👕",
        pants: "🩳",
        boots: "👞👞",
      },
      customWord: "Gamecord",
      timeoutTime: 60000,
      theme: "nature",
      winMessage: "You won! The word was **{word}**.",
      loseMessage: "You lost! The word was **{word}**.",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });
    await game.startGame();

    game.on("gameOver", (result) => {
      message.channel.send(result);
    });
  },
};
