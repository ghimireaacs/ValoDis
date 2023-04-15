const { Client, IntentsBitField } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const config = {
  activityName: 'valorant',
  numActivityUsers: 1,
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

const prevPlayers = new Map();

client.on('presenceUpdate', (oldPresence, newPresence) => {
  const channel = client.channels.cache.get(config.desiredChannelId) || client.channels.cache.find(ch => ch.type === 'GUILD_TEXT');
  const oldValPlayers = oldPresence?.guild?.members?.cache?.filter(member => {
    const presence = member.presence;
    if (!presence) return false;
    const activity = presence.activities.find(activity => {
      return activity.name.toLowerCase().includes(config.activityName);
    });
    return activity !== undefined;
  });
  const newValPlayers = newPresence?.guild?.members?.cache?.filter(member => {
    const presence = member.presence;
    if (!presence) return false;
    const activity = presence.activities.find(activity => {
      return activity.name.toLowerCase().includes(config.activityName);
    });
    return activity !== undefined;
  });
  if ((!oldValPlayers && newValPlayers) || (oldValPlayers && newValPlayers && oldValPlayers.size !== newValPlayers.size)) {
    const activePlayers = newValPlayers.map(member => `<@${member.id}>`).join(' ');
    const message = `${activePlayers} ${
      newValPlayers.size >= config.numActivityUsers ? config.desiredMessage.replace('{num}', newValPlayers.size).replace('{activity}', config.activityName) : 'is not enough players to play the game'
    }`;
    channel.send(message);
  }
});


const token = process.env.DISCORD_TOKEN;

client.login(token);
