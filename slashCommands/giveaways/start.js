const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const ms = require('ms');

module.exports = {
  name: "start",
  description: "Start a giveaway.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "duration",
      description: "Duration of the giveaway.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "winners",
      description: "Number of winners.",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "prize",
      description: "Prize for the giveaway.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "channel",
      description: "Channel where the giveaway will be created.",
      type: ApplicationCommandOptionType.Channel,
      required: false,
    },
  ],
  default_member_permissions: "KickMembers",
  run: async (client, interaction) => {

    const embed = new EmbedBuilder()
      .setAuthor({ name: interaction.guild.name, iconURL: interaction.user.avatarURL() })
      .setColor(process.env.color)
      .setFooter({
        text: process.env.footer,
        iconURL: process.env.logo,
      })
      .setImage(process.env.banner)
      .setTimestamp();

    const duration = interaction.options.getString("duration");
    const winnerCount = interaction.options.getInteger("winners");
    const prize = interaction.options.getString("prize");

    const durationInMs = ms(duration);

    const channelOption = interaction.options.getChannel("channel");
    const channel = channelOption || interaction.channel;

    client.giveawaysManager
      .start(channel, {
        duration: durationInMs,
        winnerCount,
        prize,
        
        messages: {
          giveaway: '🎉 **הגרלה חדשה!** 🎉',
          giveawayEnded: 'הגרלה הסתיימה',
          giveawayEndedButton: 'לך להגרלה',
          title: '{this.prize}',
          inviteToParticipate: '**לחץ על האימוגי למטה בשביל להיכנס להגרלה!**',
          winMessage: '**מזל טוב, {winners} זכית ב - {this.prize}!**',
          drawing: 'Drawing: {timestamp-relative} ({timestamp-default})',
          dropMessage: 'תיהיה הראשון להכנס 🎉 !',
          embedFooter: '{this.winnerCount} מנצח(ים)',
          noWinner: 'הגרלה בוטלה, לא היו מספיק משתתפים.',
          winners: 'מנצח(ים)',
          endedAt: 'נגמר ב',
          hostedBy: 'הוגרל על ידי: {this.hostedBy}',
          participants: '{participants} משתתפים',
          embedColor: 0x0000FF,
      }
      })
      .then((data) => {
        embed.setDescription(`הגרלה נוצרה ב <#${data.channelID}> עם הזמן של ${duration} ו ${winnerCount} מנצחים עם פרס ${prize}`);
        interaction.reply({ embeds: [embed], ephemeral: true });
      })
      .catch((error) => {
        embed.setDescription("An error occurred while starting the giveaway.");
        interaction.reply({ embeds: [embed], ephemeral: true });
        console.error(error);
      });
  },
};
