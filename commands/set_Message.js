const { CommandType } = require("wokcommands");
const { PermissionsBitField } = require("discord.js");
const Messages = require("../models/message");

module.exports = {
	// Required for slash commands
	description: "Set your message to be sent on each created thread.",

	// Create a legacy and slash command
	type: CommandType.SLASH,
	options: [
		{
			name: "message",
			description: "message to set",
			type: 3,
			required: true,
		},
	],
	//  nvoked when a user runs the ping command
	callback: async ({ interaction }) => {
		try {
			const {
				options,
				member,
				guild: { id: guildId },
			} = interaction;

			if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
				await interaction.reply({
					content: `Err! \`Admin only.\``,
					ephemeral: true,
				});
				return;
			}
			const message = options.getString("message");

			await interaction.reply({
				content: `Success! Set \`${message}\` as new message.`,
				ephemeral: true,
			});

			const messageDoc = await Messages.findOne({ guildId });

			if (!messageDoc) return await Messages.create({ guildId, message });

			await messageDoc.updateOne({ message });
		} catch (error) {
			console.log(error);
		}
	},
};
