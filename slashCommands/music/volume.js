const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
	name: 'volume',
	description: "Sets the current song volume.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
    options: [
        {
            name: 'volume',
            description: 'The amount of volume.',
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ],
	run: async (client, interaction) => {
        const VoiceChannel = interaction.member.voice.channel;

		if (!VoiceChannel) {
			return interaction.reply({
				content: '🔈 Please join a voice channel.',
				ephemeral: true,
			})
		}

		try {
			const queue = await client.distube.getQueue(VoiceChannel);
			const Volume = interaction.options.get('volume').value;

 			 if (!queue) {
				return interaction.reply('⛔ There is no queue.')}
  
			if (Volume > 100 || Volume < 1)
				return interaction.reply({
					content:
					'You have to specify a number between 1 and 100.',
				});

			client.distube.setVolume(VoiceChannel, Volume);
			return interaction.reply({
				content: `🔊 Volume has been set to ${Volume}%.`,
			});
		} catch (e) {
          interaction.reply('❌ Error: ' + e)
		}
	}
};
