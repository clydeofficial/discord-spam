require('dotenv').config();

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

client.pendingSpam = new Map();

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

(async () => {
  await loadCommands(client);
  await loadEvents(client);
  await client.login(process.env.TOKEN);
})();
