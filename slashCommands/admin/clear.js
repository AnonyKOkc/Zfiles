const {
    ApplicationCommandType,
    EmbedBuilder,
    ApplicationCommandOptionType,
  } = require("discord.js");
  
  module.exports = {
    name: "clear",
    description: "Clears messages in the channel.",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: "ManageMessages",
    cooldown: 3000,
    options: [
      {
        name: "amount",
        description: "The amount of messages you want to clear.",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
    run: async (client, interaction) => {
      const amount = interaction.options.get("amount").value;
  
      if (amount > 100) {
        interaction.reply({
          content: "you cannot clear more then 100 messages at once.",
          ephemeral: true,
        });
      }
      interaction.channel.bulkDelete(amount);
      const embed = new EmbedBuilder()
        .setDescription(`successfuly cleared ${amount} messages!`)
        .setColor("#2b2d31")
        .setAuthor({
          name: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        })
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        })
        .setTimestamp();
      interaction.reply({ embeds: [embed], ephemeral: true });
    },
  };
  