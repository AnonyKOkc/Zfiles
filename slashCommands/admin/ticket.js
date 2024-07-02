const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
require("dotenv").config();

module.exports = {
  name: "ticket",
  description: "ticket command",
  type: ApplicationCommandType.ChatInput,
  default_member_permissions: "Administrator",
  options: [
    {
      name: "set",
      description: "set ticket channel",
      type: 1,
      options: [
        {
          name: "channel",
          description: "the channel of the ticket",
          type: ApplicationCommandOptionType.Channel,
          required: true,
        },
      ],
    },
  ],
  run: async (client, interaction) => {
    try {
      const channel = interaction.options.get("channel").channel;

      const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.guild.name + " Ticket System!",
          iconURL: interaction.guild.iconURL(),
        })
        .setDescription(`**לחץ על הכפתור למטה בשביל לפתוח טיקט.\n\nשעות פעילות:\n
        \`א׳-ה׳ - 08:00-22:00\`\n
        \`ו׳- 08:00-15:00\`\n
        \`ש׳ - סגור\`**`)
        .setColor(process.env.color)
        .setFooter({
          text: process.env.footer,
          iconURL: process.env.logo,
        })
        .setImage(process.env.banner)
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("📨")
          .setStyle("Primary")
          .setCustomId("ticket")
      );

      await channel.send({ embeds: [embed], components: [row] });

      return interaction.reply({
        content: "Successfully sent the ticket to the channel.",
        ephemeral: true,
      });
    } catch (e) {
      console.error(e);
    }
  },
};
