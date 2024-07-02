const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "activate",
  description: "activate red alert system",
  default_member_permissions: "ManageMessages",
  options: [
    {
      name: "alerts_channel",
      description: "channel of the red alerts updates",
      type: 7,
      required: true,
    },
    {
      name: "updates_role",
      description: "updates role if neeeded.",
      type: 8,
      required: false,
    },
  ],
  default_member_permissions: "ManageMessages",

  run: async (client, interaction) => {
    const channel1 = interaction.options.getChannel("alerts_channel");
    const role = interaction.options.getRole("updates_role");
    
    if (!db.get(`settings_${interaction.guild.id}`)) {
        const key = `settings_${interaction.guild.id}`
        const data = {
            guild: interaction.guild.id,
            executer: interaction.user.id,
            channel: channel1.id,
            role: role ? role.id : false
        }

        db.set(key, data)

        interaction.reply({ content: `successfully setted up.` , ephemeral: true })

    } else {
        interaction.reply({ content: `the system already activated.` , ephemeral: true })
    }

  },
};