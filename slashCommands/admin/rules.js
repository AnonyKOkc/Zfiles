const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "rules",
  description: "rules",
  cooldown: 3000,
  userPerms: "Administrator",
      run: async (client, message) => {

    const embed = new EmbedBuilder()
      .setAuthor({ name: message.guild.name + " Announcment!", iconURL: process.env.logo })
      .setDescription(`**מוזמנים לבחור בנק שאתם רוצים הסבר עליו**`)
      .setColor(process.env.color)
      .setFooter({ text: process.env.footer, iconURL: process.env.logo })
      .setImage(process.env.banner)
      .setTimestamp();

      message.channel.send({ embeds: [embed] ,components: [
      new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
        .setCustomId(`אחר`)
        .setLabel(`אחר`)
        .setStyle(`Primary`)
        )  
        .addComponents(
          new ButtonBuilder()
      .setCustomId(`אלוף`)
      .setLabel(`אלוף`)
      .setStyle(`Primary`)
      )  
      ]})
      },
    };