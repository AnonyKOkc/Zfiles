const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "delete",
  description: "Delete a giveaway.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "message_id",
      description: "ID of the giveaway message to delete.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  default_member_permissions: "KickMembers",
  run: async (client, interaction) => {

      const messageId = interaction.options.getString('message_id');
      client.giveawaysManager
        .delete(messageId)
        .then(() => {
          interaction.reply('ההגרלה נמחקה!');
        })
        .catch((err) => {
          interaction.reply(`An error has occurred, please check and try again.\n\`${err}\``);
        });
  },
};
