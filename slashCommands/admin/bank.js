const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "bank",
  description: "bank",
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
        .setCustomId(`Belo`)
        .setLabel(`Belo`)
        .setStyle(`Primary`)
        )  
        .addComponents(
          new ButtonBuilder()
      .setCustomId(`ASTROPAY`)
      .setLabel(`ASTROPAY`)
      .setStyle(`Primary`)
      )  
      .addComponents(
        new ButtonBuilder()
    .setCustomId(`LETSBIT`)
    .setLabel(`LETSBIT`)
    .setStyle(`Primary`)
    ) 
    .addComponents(
      new ButtonBuilder()
  .setCustomId(`MERCADO PAGO`)
  .setLabel(`MERCADO PAGO`)
  .setStyle(`Primary`)
  ) 
      ]})
      },
    };