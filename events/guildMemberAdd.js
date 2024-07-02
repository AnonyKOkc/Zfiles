const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, createdTime } = require("discord.js");
const client = require("..");

client.on("guildMemberAdd", (member) => {
  const channel = client.channels.cache.get(process.env.welcome);
  const createdTime = parseInt(member.user.createdTimestamp / 1000);

  const embed = new EmbedBuilder()
    .setTitle(`__${member.guild.name} Member!__`)
    .setDescription(`**Hey ${member}, And welcome To \`${member.guild.name}\`\nWe are Now \`${member.guild.memberCount}\`th  Members\nCreated: <t:${createdTime}:R> **`)
    .setColor(process.env.color)
    .setFooter({ text: process.env.footer, iconURL: process.env.logo })
    .setImage(process.env.banner)
    .setThumbnail(member.user.displayAvatarURL({ format: "png" }));

    channel.send({ embeds: [embed] ,components: [
      new ActionRowBuilder()
      .addComponents(
          new ButtonBuilder()
          .setLabel(`${member.guild.memberCount - 1} Members`)
          .setStyle('Primary')
          .setCustomId(`2`)
          .setDisabled(true)
      )    
      .addComponents(
          new ButtonBuilder()
          .setLabel(`Designs `)
          .setStyle('Danger')
          .setCustomId(`3`)
          .setDisabled(true)
      )
      .addComponents(
        new ButtonBuilder()
        .setLabel(`Rules`)
        .setURL(`https://discord.com/channels/1184979246129631444/1185178664460107836`)
        .setStyle(ButtonStyle.Link)
        .setDisabled(false)
    )  
 
  ]})
});