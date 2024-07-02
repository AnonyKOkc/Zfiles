const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
	name: 'queue',
	description: "The current queue.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	run: async (client, interaction) => {
        const VoiceChannel = interaction.member.voice.channel;

		if (!VoiceChannel) {
			return interaction.reply({
				content: '🔈 Please join a voice channel.',
				ephemeral: true,
			})
		}

		try {
			const client = interaction.client
			const queue = await client.distube.getQueue(VoiceChannel);

			if (!queue) {
				return interaction.reply('⛔ There is no queue.');
			}

			const topTen = queue.songs.slice(0, 10);

			const embed = new EmbedBuilder()
			.setColor("White")
			.setDescription(`${topTen.map((song, id) => {
                let p;
                if (id == 0) {
                    p = '\🏆';
                } else if (id == 1) {
                    p = '\🥈';
                } else if (id == 2) {
                    p = '\🥉';
                } else {
                    p = `${id + 1}`;
                }
                return `\n**${p}.** ${song.name} - \`${song.formattedDuration}\``;
            })}`);

			return interaction.reply({ embeds: [embed] });
		} catch (e) {
			console.log(e);
			return interaction.reply('❌ Error: ' + e);
		}
	}
};
