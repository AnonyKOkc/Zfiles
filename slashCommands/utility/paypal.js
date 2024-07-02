const {
    ApplicationCommandType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ApplicationCommandOptionType,
  } = require("discord.js");
  
  module.exports = {
    name: "paypal",
    description: "checking the amount after paypal fee",
    type: ApplicationCommandType.ChatInput,
    cooldown: 3000,
    options: [
      {
        name: "amount",
        description: "amount of payment",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
    run: async (client, interaction) => {
      const amount = interaction.options.get("amount")?.value;
  
      function after(amount) {
        return amount + (4.49 / 100) * amount + 1.6;
      }
      function fee(amount) {
        return amount - (4.49 / 100) * amount - 1.6;
      } 
      
      const embed = new EmbedBuilder()
        .setTitle(`Paypal Fee Calculator`)
        .addFields(
          { name: `Before Fee`, value: `- ${amount}`, inline: true },
          { name: `After Fee`, value: `- ${fee(amount)}`, inline: true },
          { name: `Need To Pay`, value: `- ${after(amount)}`, inline: true }
        )
        .setColor("Red")
        .setFooter({
          text: "Adidi Testing",
          iconURL: ("https://cdn.discordapp.com/avatars/526059258152747008/2f342a5a00d29d82765e81cac2973276.webp"),
        })
        .setImage("https://cdn.discordapp.com/avatars/526059258152747008/2f342a5a00d29d82765e81cac2973276.webp")
        .setTimestamp();
  
      const button = new ButtonBuilder()
        .setCustomId("result")
        .setLabel(`${Math.round(after(amount))}`)
        .setStyle("Success")
        .setDisabled(true)
      const row = new ActionRowBuilder().addComponents(button);
      return interaction.reply({ embeds: [embed], components: [row] });
    },
  };