const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "paypal",
  description: "paypal",
  cooldown: 3000,
  userPerms: "Administrator",
      run: async (client, message) => {
    message.delete()
    const embed = new EmbedBuilder()
      .setAuthor({ name: message.guild.name + " Announcment!", iconURL: process.env.logo })
      .setDescription(`**לתשלום מוזמנים לבחור במה תשלמו**`)
      .setColor(process.env.color)
      .setFooter({ text: process.env.footer, iconURL: process.env.logo })
      .setImage(process.env.banner)
      .setTimestamp();

      const embed1 = new EmbedBuilder()
      .setAuthor({ name: message.guild.name + " Announcment!", iconURL: process.env.logo })
      .setDescription(`**! חובה ללחוץ על V בתשלום**`)
      .setColor(process.env.color)
      .setFooter({ text: process.env.footer, iconURL: process.env.logo })
      .setImage(process.env.PAYPALDONATE)
      .setTimestamp(); 
     
 message.channel.send({ embeds: [embed, embed1 ] ,components: [
      new ActionRowBuilder()
          .addComponents(
        new ButtonBuilder()
        .setLabel(`Paypal`)
        .setURL(process.env.linkpaypal)
        .setStyle(ButtonStyle.Link)
        .setDisabled(false)
    )  
  ]})
  },
};