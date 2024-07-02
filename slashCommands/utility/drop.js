const {
    ApplicationCommandType,
    EmbedBuilder,
    ApplicationCommandOptionType,
  } = require("discord.js");
  const client = require("../..");
  
  module.exports = {
    name: "drop",
    description: "a drop command.",
    type: ApplicationCommandType.ChatInput,
    default_member_permissions: "Administrator",
    cooldown: 3000,
    options: [
      {
        name: "drop",
        description: "what you want to drop?",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "requirements",
        description: "what are the requirements?",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
    run: async (client, interaction) => {
      const drop = interaction.options.get("drop").value;
      const requirements = interaction.options.get("requirements").value;
  
      const embed = new EmbedBuilder()
      .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
      .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
      .setColor(process.env.color)
      .setTimestamp()
      .addFields( { name: "הדרופ", value: `\`\`\`${drop}\`\`\``, inline: true }, { name: "החובות", value: `\`\`\`${requirements}\`\`\``, inline: true })
      .setThumbnail(process.env.logo)
      .setImage(process.env.banner)
        
        
      interaction.reply({content: "Dropping...", ephemeral: true})
      for (let i = 1; i <= 10; i++) {
        interaction.channel.send(`${i}`)
        await new Promise((resolve) => {
          setTimeout(resolve, 1000)
        })
      }
      interaction.channel.send({ embeds: [embed] })
    }
  };