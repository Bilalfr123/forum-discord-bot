const Messages = require("../../models/message");

module.exports = async (thread) => {
	try {
		const messageDoc = await Messages.findOne({ guildId: thread.guild.id });

		const message = messageDoc?.message ?? "No message set yet.";
		const formattedMessage = message.replace(/\\n/g, "\n");

		await thread.send(formattedMessage);
	} catch (error) {
		console.log(error);
	}
};
