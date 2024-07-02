const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
	name: 'resume',
	description: "resume the current song.",
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
			return interaction.reply('⛔ There is no queue.')}

			await queue.resume(VoiceChannel);
			return interaction.reply('▶️ Resumed song.');
		} catch (e) {
          interaction.reply('❌ Error: ' + e)
		}
	}
};
