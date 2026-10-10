const { REST, Routes } = require('discord.js');

module.exports = {
  name: 'clientReady',
  once: true,
  async execute(client) {
    const commands = [...client.commands.values()].map((cmd) => cmd.data.toJSON());
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
      await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    } catch (error) {
      console.error('Failed to register commands:', error);
    }

    console.log(`${client.user.username} Aktif!`);
  },
};
