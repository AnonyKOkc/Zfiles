const {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    ButtonBuilder,
  } = require("discord.js");
  
  module.exports = {
    name: "apply",
    description: "Set simple application for staff test.",
    cooldown: 3000,
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: "Administrator",
    options: [
      {
        name: "set",
        description: "channel.",
        type: 1,
        options: [
          {
            name: "channel",
            description: "The channel of apply",
            type: ApplicationCommandOptionType.Channel,
            required: true,
          },
        ],
      },
    ],
    run: async (client, interaction) => {
      if (interaction.options._subcommand === "set") {
        try {
          const channel = interaction.options.get("channel").channel;
  
          const embed = new EmbedBuilder()
            .setTitle("Staff Application")
            .setDescription(`Click the button to start an application.`)
            .setColor(process.env.color)
            .setFooter({
              text: process.env.footer,
              iconURL: process.env.logo,
            })
            .setImage(process.env.banner)
            .setTimestamp();
  
          const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel("Apply")
              .setStyle("Success")
              .setCustomId("start_application")
          );
  
          await channel.send({ embeds: [embed], components: [buttons] });
          return interaction.reply({
            content: `Setted up application.`,
            ephemeral: true,
          });
        } catch (err) {
          console.log(err);
          return interaction.reply({
            content: `Sorry, I failed setting up...`,
            ephemeral: true,
          });
        }
      }
    },
  };
  