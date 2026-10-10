const {
  SlashCommandBuilder,
  ApplicationIntegrationType,
  InteractionContextType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spam')
    .setDescription('Belirtilen mesajı spam yapar.')
    .addStringOption((opt) =>
      opt
        .setName('mesaj')
        .setDescription('Mesaj')
        .setRequired(true)
        .setMaxLength(1500),
    )
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ]),

  repeatCount: 5,

  async execute(interaction, { client }) {
    const mesaj = interaction.options.getString('mesaj', true).slice(0, 1500);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('spam:send')
        .setLabel('Gönder')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('spam:cancel')
        .setLabel('İptal')
        .setStyle(ButtonStyle.Secondary),
    );

    await interaction.reply({
      content: mesaj,
      components: [row],
      flags: MessageFlags.Ephemeral,
    });
    const control = await interaction.fetchReply();

    client.pendingSpam?.set(control.id, {
      mesaj,
      count: 5,
      userId: interaction.user.id,
      slashToken: interaction.token,
      appId: interaction.applicationId,
      sending: false,
      done: false,
    });
    const timer = setTimeout(() => client.pendingSpam?.delete(control.id), 14 * 60 * 1000);
    if (typeof timer.unref === 'function') timer.unref();
  },
};
