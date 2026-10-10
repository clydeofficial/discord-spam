const fs = require('fs');
const path = require('path');

const eventsDir = path.join(__dirname, '..', 'events');

module.exports = {
  async loadEvents(client) {
    for (const file of fs.readdirSync(eventsDir)) {
      if (!file.endsWith('.js')) continue;
      const event = require(path.join(eventsDir, file));
      if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
      } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
      }
    }
  },
};
