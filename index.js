const { Client, IntentsBitField, Partials } = require("discord.js");
const WOK = require("wokcommands");
const { DefaultCommands } = WOK;
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { createClient } = require("redis");
dotenv.config({ path: "./.env" });
const redisClient = createClient();

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.MessageContent,
	],
	partials: [Partials.Channel],
});

client.on("ready", async () => {
	console.log(`${client.user.username} is running 🧶`);

	await mongoose
		.connect(process.env.MONGO_URI)
		.catch((e) => console.log("Something went wrong with the database", e));

	console.log("Connected to database! 📅");

	new WOK({
		client,
		commandsDir: path.join(__dirname, "./commands"),
		events: {
			dir: path.join(__dirname, "events"),
		},
		disabledDefaultCommands: [
			DefaultCommands.ChannelCommand,
			DefaultCommands.CustomCommand,
			DefaultCommands.Prefix,
			DefaultCommands.RequiredPermissions,
			DefaultCommands.RequiredRoles,
			DefaultCommands.ToggleCommand,
		],
		cooldownConfig: {
			errorMessage: "Please wait {TIME} before doing that again.",
			botOwnersBypass: false,
			dbRequired: 300,
		},
	});
});
client.login(process.env.TOKEN);
