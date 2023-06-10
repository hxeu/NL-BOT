import { config } from 'dotenv';
import {
  Client,
  GatewayIntentBits,
  Routes,
} from 'discord.js';
import { REST } from '@discordjs/rest';
import MoveCommand from './commands/move.js';


config();

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    
  ],
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.on('ready', () => console.log(`${client.user.tag} has logged in!`));


client.on('messageCreate', (message) => {
  const content = message.content.toLowerCase();
  if (content.includes('eiji') || content.includes('jordan')) {
    
    const responses = [
      "tu vois tu vois 😡😡💢 est-ce que t'as vu que le bazooka 💥😡il me l'a mis à moi 😢 alors qu'il t'a vu avant 👀🫵 vasy tranquille 😤😤dites ce que vous voulez les frères 🥲🥲",
      'https://cdn.discordapp.com/attachments/1117035450591354931/1117035679180922961/le-J-word.mp4',
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    message.channel.send(randomResponse);
    }
  }
);


client.on('interactionCreate', async (interaction) => {
  if (interaction.commandName === 'move') {
    const guild = client.guilds.cache.get(GUILD_ID);

    // Récupérer l'utilisateur ciblé depuis les options de l'interaction
    const targetUser = interaction.options.getUser('user');
    if (!targetUser) {
      await interaction.reply('Utilisateur non trouvé.');
      return;
    }

    const targetMember = guild.members.cache.get(targetUser.id);
    if (!targetMember) {
      await interaction.reply('Utilisateur pas sur le serveur.');
      return;
    }

    const voiceChannel = targetMember.voice.channel;
    if (!voiceChannel) {
      await interaction.reply("L'utilisateur n'est pas dans un channel vocal.");
      return;
    }

    let channels;
    try {
      channels = (await guild.channels.fetch()).filter(channel => channel.isVoiceBased());
    } catch (error) {
      console.error('Error fetching channels:', error);
      return;
    }

    // Filter voice channels to exclude the current channel
    const voiceChannels = channels.filter(channel => channel !== voiceChannel);

    if (voiceChannels.size === 0) {
      await interaction.reply('No other voice channels found.');
      return;
    }

    // Move the user to a random voice channel
    const randomVoiceChannel = voiceChannels.random();

    await targetMember.voice.setChannel(randomVoiceChannel);

    // Move the user back to their original voice channel
    await targetMember.voice.setChannel(voiceChannel);

    await interaction.reply(`HOP ${targetMember.user.username} PETIT PAS DE DANSE POUR TOI`);
    console.log(`${interaction.user.username} moved ${targetMember.user.username}`);
    
  }
});

async function main() {
  const commands = [
    MoveCommand,
  ];
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    client.login(TOKEN);
  } catch (err) {
    console.log(err);
  }
}

main();
