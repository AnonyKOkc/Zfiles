const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
	name: 'play',
	description: "play a song.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
    options: [
        {
            name: 'song',
            description: 'The song name or link.',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
	run: async (client, interaction) => {
        const song_name = interaction.options.get('song').value;
		const VoiceChannel = interaction.member.voice.channel;

		if (!VoiceChannel)
			return interaction.reply({
				content: '🔈 Please join a voice channel.',
				ephemeral: true,
			});

		try {
            client.distube.play(
                VoiceChannel,
                song_name,
                { textChannel: interaction.channel, member: interaction.member }
            );
            return interaction.reply({
                content: 'Playing',
                ephemeral: true,
            });
		} catch (e) {
           interaction.reply('❌ Error: ' + e)
		}
	}
};
