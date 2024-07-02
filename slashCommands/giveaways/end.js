const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "end",
  description: "End a giveaway.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "message_id",
      description: "ID of the giveaway message to end.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  default_member_permissions: "KickMembers",
  run: async (client, interaction) => {

      const messageId = interaction.options.getString('message_id');
      client.giveawaysManager
        .end(messageId)
        .then(() => {
          interaction.reply('ההגרלה הסתיימה!');
        })
        .catch((err) => {
          interaction.reply(`An error has occurred, please check and try again.\n\`${err}\``);
        });
  },
};
