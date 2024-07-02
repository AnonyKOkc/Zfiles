const client = require("..");
const { ActivityType, EmbedBuilder } = require("discord.js")

client.on("ready", () => {


  const guild = client.guilds.cache.get(process.env.guild)

  setInterval(() => {
      client.user.setActivity({ name: 'Custom Status', state: `${guild.memberCount - 1} Members!`, type: ActivityType.Custom })
  }, 10000)
})




