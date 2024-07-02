const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "say",
  description: "say command.",
  cooldown: 3000,
  userPerms: "Administrator",
  run: async (client, message, args) => {
    message.delete()
    const embed = new EmbedBuilder()
      .setAuthor({ name: message.guild.name + " Announcment!", iconURL: process.env.logo })
      .setDescription(args.join(" "))
      .setColor(process.env.color)
      .setFooter({ text: process.env.footer, iconURL: process.env.logo })
      .setImage(process.env.banner)
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
