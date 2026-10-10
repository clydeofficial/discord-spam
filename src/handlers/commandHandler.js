const fs = require('fs');
const path = require('path');

const commandsDir = path.join(__dirname, '..', 'commands');

module.exports = {
  async loadCommands(client) {
    if (!fs.existsSync(commandsDir)) return client.commands;
    for (const file of fs.readdirSync(commandsDir)) {
      if (!file.endsWith('.js')) continue;
      const command = require(path.join(commandsDir, file));
      client.commands.set(command.data.name, command);
    }
    return client.commands;
  },
};
