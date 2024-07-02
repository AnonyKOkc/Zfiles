const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "ban",
  description: "ban command.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
        name: "user",
        description: "user to ban.",
        type: ApplicationCommandOptionType.User,
        required: true,
    },
  ],
  default_member_permissions: "BanMembers",

  run: async (client, interaction) => {
    
        const embed = new EmbedBuilder()
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.user.avatarURL() })
        .setDescription("The user has been banned.")
        .setColor("Random")
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() })
        .setTimestamp();
        
        const user = interaction.options.getUser("user");
        interaction.guild.members.ban(user);
        interaction.reply({ embeds: [embed], ephemeral: true });
        
},
}