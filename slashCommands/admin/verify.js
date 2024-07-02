const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "verify",
  description: "verify command.",
  cooldown: 3000,
  default_member_permissions: "Administrator",
  run: async (client, interaction) => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.guild.name,
        iconURL: process.env.logo,
      })
      .setDescription(`Please click on the button to verify!`)
      .setColor(process.env.color)
      .setFooter({
        text: process.env.footer,
        iconURL: process.env.logo,
      })
      .setImage(process.env.banner)
      .setTimestamp();

    const buttons = new ButtonBuilder()
      .setCustomId("verify")
      .setLabel("Verify")
      .setStyle("Primary");

    const row = new ActionRowBuilder().addComponents(buttons);
    interaction.reply({content: "Sent.", ephemeral: true})
    interaction.channel.send({ embeds: [embed], components: [row] });
  },
};
