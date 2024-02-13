const { EmbedBuilder } = require('discord.js');
module.exports = {
	name: 'snipe',
	aliases: ['snip', 'snipe', 's'],
	description: 'Check messages that was delete',
	userPerms: [],
	botPerms: [],
	usage: ['snipe'],
	developerOnly: false,
	run: async (client, message, args) => {
		try {

			let msg = client.snipes.get(message.channel.id)
			if (!msg) {
				return args.error("There are no deleted messages to snipe in this channel.");
			}
			let msg1 = msg[0];
			const embed = new EmbedBuilder()
				.setAuthor({ name: msg1.author.tag, iconURL: msg1.author.displayAvatarURL() })
				.setDescription(msg1.content || 'No content available')
				.setColor(client.config.color)
				.setTimestamp(msg1.timestamp);

			if (msg.length > 1) {
				let x = [];
				msg.forEach(async (snipe) => {
					const snipeEmbed = new EmbedBuilder()
						.setAuthor({ name: snipe.author.tag, iconURL: snipe.author.displayAvatarURL() })
						.setDescription(snipe.content || null)
						.setColor(client.config.color)
						.setTimestamp(snipe.timestamp);
					return x.push(snipeEmbed);
				});
				await pagination(message, x.reverse());
			} else { message.channel.send({ embeds: [embed] }); }
		} catch (err) {
			args.error(`I couldn't snipe that message!`);
		}
	},
};