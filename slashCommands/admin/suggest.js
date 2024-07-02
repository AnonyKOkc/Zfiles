const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js');
const db = require("quick.db")

module.exports = {
    name: 'suggest',
    description: "Suggest somthing to the corrent guild.",
    type: ApplicationCommandType.ChatInput,
    cooldown: 60*1000*60*24,
    options: [
        {
            name: 'suggest',
            description: 'The suggestion.',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {
        const message = interaction.options.get('suggest').value
        const embed = new EmbedBuilder()
            .setDescription(`\`\`\`${message}\`\`\``)
            .setColor(process.env.color)
            .setImage(process.env.banner)
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
            .setFooter({ text: `suggested by ${interaction.user.username}`, iconURL: interaction.guild.iconURL() })
            .setTimestamp();

        const components = [new ButtonBuilder()
            .setLabel("/ 0")
            .setEmoji("1080085025866907648")
            .setStyle('Success')
            .setCustomId("accepted")
            ,
        new ButtonBuilder()
            .setLabel("/ 0")
            .setEmoji("1080085021739716678")
            .setStyle("Danger")
            .setCustomId("denied"),
        new ButtonBuilder()
            .setCustomId("VoteList")
            .setLabel(`Vote list`)
            .setStyle("Primary")
        ];

        const row = new ActionRowBuilder()
            .addComponents(components);
        const channel = client.channels.cache.get(process.env.suggestionsChannel)
        interaction.reply({ content: `Thank you for that suggestion.`, ephemeral: true })
        const embed_data = await channel.send({ embeds: [embed], fetchReply: true, components: [row] })
        await db.set(`accepted_${embed_data.id}.users`, [])
        await db.set(`denied_${embed_data.id}.users`, [])
    }
};
