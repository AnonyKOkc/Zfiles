const { ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "edit",
  description: "Edit a giveaway.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "message_id",
      description: "ID of the giveaway message to edit.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "add_time",
      description: "Amount of time to add to the giveaway (in milliseconds).",
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
    {
      name: "new_winner_count",
      description: "New number of winners for the giveaway.",
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
    {
      name: "new_prize",
      description: "New prize for the giveaway.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  default_member_permissions: "KickMembers",
  run: async (client, interaction) => {
    
      const messageId = interaction.options.getString('message_id');
      const addTime = interaction.options.getInteger('add_time');
      const newWinnerCount = interaction.options.getInteger('new_winner_count');
      const newPrize = interaction.options.getString('new_prize');

      const editOptions = {};

      if (addTime) {
        editOptions.addTime = addTime;
      }
      if (newWinnerCount) {
        editOptions.newWinnerCount = newWinnerCount;
      }
      if (newPrize) {
        editOptions.newPrize = newPrize;
      }

      client.giveawaysManager
        .edit(messageId, editOptions)
        .then(() => {
          interaction.reply('ההגרלה נערכה!');
        })
        .catch((err) => {
          interaction.reply(`An error has occurred, please check and try again.\n\`${err}\``);
        });
  },
};
