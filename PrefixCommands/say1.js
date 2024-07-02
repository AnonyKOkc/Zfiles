const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "say1",
  description: "say somthing from the bot.",
  cooldown: 3000,
  userPerms: "Administrator",
  run: async (client, message, args) => {
    var say = args.join(" ")
    

    message.delete()


    message.channel.send({content: say})
  },
};