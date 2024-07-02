const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "timeout",
  description: "timeout command.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
        name: "user",
        description: "user to timeout.",
        type: ApplicationCommandOptionType.User,
        required: true,
    },
    {
        name: "time",
        description: "time to timeout [minutes].",
        type: ApplicationCommandOptionType.Integer,
        required: true,
    }
  ],
  default_member_permissions: "ManageMessages",
  run: async (client, interaction) => {
    
        const time = interaction.options.getInteger("time");

        const embed = new EmbedBuilder()
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.user.avatarURL() })
        .setDescription(`The user has been timeouted for ${time}.`)
        .setColor("Random")
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() })
        .setTimestamp();
        
        const user = interaction.options.getMember("user");
        user.timeout(time * 60 * 1000);
        interaction.reply({ embeds: [embed], ephemeral: true });
        
},
}