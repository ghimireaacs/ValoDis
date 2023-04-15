const { Client, IntentsBitField } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const config = {
  activityName: 'valorant',
  numActivityUsers: 2,
  desiredChannelId: process.env.DISCORD_CHANNEL_ID,
  desiredMessage: 'Oi, K garira aau {activity} khelna, {num} jana kheliraxan'
};

const client = new Client({
  intents:[
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.GuildPresences,
      IntentsBitField.Flags.GuildMessageReactions,
      IntentsBitField.Flags.GuildMessageTyping,
      IntentsBitField.Flags.MessageContent
  ],
});

client.on('presenceUpdate', (oldPresence, newPresence) => {
  const channel = client.channels.cache.get(config.desiredChannelId) || client.channels.cache.find(ch => ch.type === 'GUILD_TEXT');
  const valPlayers = newPresence.guild.members.cache.filter(member => {
    const presence = member.presence;
    if (!presence) return false;
    const activity = presence.activities.find(activity => {
      return activity.name.toLowerCase().includes(config.activityName);
    });
    return activity !== undefined;
  });
  if (valPlayers.size >= config.numActivityUsers) {
    const message = config.desiredMessage.replace('{num}', valPlayers.size).replace('{activity}', config.activityName);
    channel.send(message);
  }
});

const token = process.env.DISCORD_TOKEN;

client.login(token);