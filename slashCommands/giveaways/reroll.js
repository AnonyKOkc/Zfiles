const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "reroll",
  description: "Reroll a giveaway.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "message_id",
      description: "ID of the giveaway message to reroll.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  default_member_permissions: "KickMembers",
  run: async (client, interaction) => {

      const messageId = interaction.options.getString('message_id');
      client.giveawaysManager
        .reroll(messageId)
        .then(() => {
          interaction.reply('ההגרלה הודגרלה מחדש!');
        })
        .catch((err) => {
          interaction.reply(`An error has occurred, please check and try again.\n\`${err}\``);
        });
  },
};
