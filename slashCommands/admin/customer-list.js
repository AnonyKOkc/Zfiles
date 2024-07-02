const {EmbedBuilder,ActionRowBuilder,ButtonBuilder} = require("discord.js");
require("dotenv").config();


module.exports = {
  name: 'customers-list',
  description: `Show a list of the customers`,
  type: 1,
  cooldown: 3000,
  run: async (client, interaction) => {
    const customersRole = interaction.guild.roles.cache.find(role => role.name === 'Customer');
    const customerCount = customersRole.members.size;
    const customers = customersRole.members.map(member => `• ${member.user} - <a:circle:1196924183960096808>`).join('\n');
    const embed = new EmbedBuilder()
      .setTitle(`__Customers__ [${customerCount}]`)
      .setDescription(customers)
      .setThumbnail(interaction.guild.iconURL({dynamic: true}))
      .setColor(process.env.color)
      
    
    const reply = await interaction.channel.send({ embeds: [embed] });

    setInterval(() => {
      const customers = customersRole.members.map(member => `• ${member.user} - <a:circle:1196924183960096808>`).join('\n');
      const updatedCount = customersRole.members.size;
      embed.setTitle(`Customers [${updatedCount}]`);
      embed.setDescription(customers);
      reply.edit({ embeds: [embed] });
    }, 20000);
  }
};