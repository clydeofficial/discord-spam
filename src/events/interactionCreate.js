const { MessageFlags, Routes } = require('discord.js');
const { makeURLSearchParams } = require('@discordjs/rest');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

module.exports = {
  name: 'interactionCreate',
  async execute(client, interaction) {
    if (interaction.isButton() && interaction.customId.startsWith('spam:')) {
      try {
        await handleSpamButton(client, interaction);
      } catch (error) {
        console.error('spam button error:', error);
      }
      return;
    }

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, { client });
    } catch (error) {
      if (error?.code === 10062) return;
      console.error(`Command /${interaction.commandName} error:`, error);
      try {
        if (!interaction.isRepliable()) return;
        if (interaction.deferred) {
          await interaction.editReply({ content: 'Bu komut çalıştırılırken bir hata oluştu.' });
        } else {
          await interaction.reply({ content: 'Bu komut çalıştırılırken bir hata oluştu.', flags: MessageFlags.Ephemeral });
        }
      } catch {
      }
    }
  },
};

async function handleSpamButton(client, interaction) {
  const control = interaction.message;
  const controlId = control?.id;
  const pending = controlId ? client.pendingSpam?.get(controlId) : undefined;
  const isSend = interaction.customId === 'spam:send';
  const mesaj = (pending?.mesaj ?? control?.content ?? '').slice(0, 1500);
  const count = pending?.count ?? 5;

  if (!mesaj || !controlId) {
    try {
      await interaction.reply({ content: 'Spam verisi bulunamadı, komutu tekrar çalıştır.', flags: MessageFlags.Ephemeral });
    } catch {
    }
    return;
  }

  if (pending?.userId && interaction.user.id !== pending.userId) {
    try {
      await interaction.reply({ content: 'Bu buton sana ait değil.', flags: MessageFlags.Ephemeral });
    } catch {
    }
    return;
  }

  if (pending?.sending || pending?.done) {
    try {
      await interaction.reply({ content: 'Bu spam zaten gönderildi.', flags: MessageFlags.Ephemeral });
    } catch {
    }
    return;
  }

  if (!isSend) {
    if (controlId) client.pendingSpam?.delete(controlId);
    try {
      await interaction.update({ content: 'İptal edildi.', components: [] });
    } catch {
    }
    await deleteControl(client, interaction, pending, controlId);
    return;
  }

  if (pending) pending.sending = true;

  try {
    await interaction.update({ content: mesaj, components: [] });
  } catch (error) {
    if (pending) pending.sending = false;
    if (error?.code === 10062) return;
    console.error('spam update error:', error);
    return;
  }

  let firstId = null;
  for (let i = 0; i < count; i++) {
    if (i > 0) await wait(500);
    const body = { content: mesaj };
    if (firstId) body.message_reference = { message_id: firstId, fail_if_not_exists: false };
    try {
      const data = await client.rest.post(Routes.webhook(interaction.applicationId, interaction.token), {
        auth: false,
        query: makeURLSearchParams({ wait: true }),
        body,
      });
      if (!firstId) firstId = data?.id ?? null;
    } catch (error) {
      if (error?.code === 10062 || error?.code === 10015 || error?.status === 404) return;
      console.error('spam followup error:', error);
    }
  }

  await deleteControl(client, interaction, pending, controlId);
  if (pending) pending.done = true;
  if (controlId) {
    setTimeout(() => client.pendingSpam?.delete(controlId), 60 * 1000)?.unref?.();
  }
}

async function deleteControl(client, interaction, pending, controlId) {
  try {
    await interaction.message?.delete();
    return;
  } catch {
  }
  try {
    await interaction.deleteReply();
    return;
  } catch {
  }
  if (pending?.slashToken && pending?.appId) {
    try {
      await client.rest.delete(
        Routes.webhookMessage(pending.appId, pending.slashToken, controlId),
        { auth: false },
      );
    } catch {
    }
  }
}
