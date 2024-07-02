const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const client = require("..");

client.on("guildMemberRemove", (member) => {
  const channel = client.channels.cache.get(process.env.Remove);

  const embed = new EmbedBuilder()
    .setTitle(`__${member.guild.name} Member!__`)
    .setDescription(`**Bey ${member.user} to the ${member.guild.name}!\nYou're the \`${member.guild.memberCount}\` member in the guild.**`)
    .setColor(process.env.color)
    .setFooter({ text: process.env.footer, iconURL: process.env.logo })
    .setImage(process.env.banner)
    .setThumbnail(member.user.displayAvatarURL({ format: "png" }));

  channel.send({ embeds: [embed] ,components: [
    new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setLabel(`${member.guild.memberCount - 1} Members`)
        .setStyle('Secondary')
        .setCustomId(`2`)
        .setDisabled(true)
    )    
    .addComponents(
        new ButtonBuilder()
        .setLabel(`ZenoN Shop`)
        .setStyle('Secondary')
        .setCustomId(`3`)
        .setDisabled(true)
    )
]})
});
