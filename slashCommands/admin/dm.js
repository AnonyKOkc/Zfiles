const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "dm",
  description: "dm command.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "category of the stock.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
        name: "message",
        description: "message to send.",
        type: ApplicationCommandOptionType.String,
        required: true,
    }
  ],
  default_member_permissions: "Administrator",

  run: async (client, interaction) => {
    const user = interaction.options.getUser("user");
    const message = interaction.options.getString("message");
    const embed = new EmbedBuilder()
    .setAuthor({ name: interaction.guild.name + " - Update", iconURL: client.user.displayAvatarURL() })
    .setDescription(`**${message}**`)
    .setColor("Random")
    .setFooter({text: `sent by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL()})
    .setTimestamp();
    user.send({ embeds: [embed] });
    interaction.reply({ content: "Successfully sent.", ephemeral: true});
},
}