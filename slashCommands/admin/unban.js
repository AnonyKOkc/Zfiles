const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: 'unban',
  description: 'unban command.',
  options: [
    {
        name: "userid",
        description: "user to unban.",
        type: ApplicationCommandOptionType.String,
        required: true,
    },

  ],  
  default_member_permissions: "BanMembers",
  run: async (client, interaction) => {
    
        const embed = new EmbedBuilder()
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.user.avatarURL() })
        .setDescription("The user has been unbanned.")
        .setColor("Random")
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() })
        .setTimestamp();
        
        const user = interaction.options.getString("userid");
        interaction.guild.members.unban(user);
        interaction.reply({ embeds: [embed], ephemeral: true });
        
},
}