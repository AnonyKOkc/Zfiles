const {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    ButtonBuilder,
  } = require("discord.js");
  
  module.exports = {
    name: "feedback",
    description: "[CUSTOMERS] Send a feedback (Feedback-System)",
    cooldown: 3000,
        options: [
          {
            name: "your-feedback",
            description: "Write your feedback",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: "rating",
            description: "Write your star rating for 1 to 5",
            type: ApplicationCommandOptionType.Integer,
            required: true,
          },
        ],
    run: async (client, interaction) => {
        try {
            const feedback = interaction.options.get("your-feedback").value;
            const rating = interaction.options.getInteger("rating");
            let stars = "";
  if (rating < 1) {
  stars = "⭐";
  } else if (rating > 5) {
  stars = "⭐⭐⭐⭐⭐";
  } else {
  stars = "⭐".repeat(rating);
  }
            const feedbackChannel = interaction.guild.channels.cache.get(process.env.feedbackChannel);
            const embed = new EmbedBuilder()
            .setColor(process.env.color)
            .setAuthor({
                name: interaction.guild.name + " | Feedback",
                iconURL: interaction.guild.iconURL()
            })
            .setThumbnail(interaction.user.displayAvatarURL())
            .addFields({ name: 'User:', value: `**\`${interaction.user.tag}\`(${interaction.user})**`,inline: false})
            .addFields({ name: 'Feedback:', value: `**\`${feedback}\`**`,inline: false})
            .addFields({ name: 'Rating:', value: `**\`${stars}\`**`,inline: true})
            
            .setTimestamp();
            feedbackChannel.send({embeds: [embed]});
            interaction.reply({content: `**Your feedback has been submitted to ${feedbackChannel}**`,ephemeral: true});
        } catch (err) {
          console.log(err);
        }
    },
  };
  