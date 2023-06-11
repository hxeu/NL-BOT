import { config } from 'dotenv';
import {
  Client,
  GatewayIntentBits,
  Routes,
} from 'discord.js';
import { REST } from '@discordjs/rest';
import MoveCommand from './src/commands/move.js';
import TourCommand from './src/commands/tour.js';
import NukeCommand from './src/commands/nuke.js';


config();


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
      'https://cdn.discordapp.com/attachments/1117035450591354931/1117071070646775910/RAZE.jpg',
      'https://cdn.discordapp.com/attachments/1117035450591354931/1117155801342169118/pas-le-meme-spray.png',
      'les egirls 👧 arrêtez 🖐️🛑 de jouer ⏯️ à valo',
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    message.channel.send(randomResponse);
    }
  }
);


client.on('interactionCreate', async (interaction) => {
  if (interaction.commandName === 'nuke') {
    await interaction.deferReply(); // Défère la réponse initiale
    
    // Crée un message de base avec un pourcentage initial de 0
    const reply = await interaction.editReply('Le serveur va disparaitre... byebye :) 0% 🚀');

    // Boucle pour mettre à jour le pourcentage de 0% à 99%
    for (let i = 1; i <= 99; i++) {
      // Met à jour le message avec le nouveau pourcentage
      await reply.edit(`Le serveur va disparaitre... byebye :) ${i}% 🚀`);
      await new Promise(resolve => setTimeout(resolve, 1)); // Attend 100 millisecondes
    }

    // Message de chargement terminé
    await reply.edit('ERREUR 404 : CHARGEMENT IMPOSSIBLE ❌❌❌ NUKE ANNULÉ ❌❌❌');
  }

  if (interaction.commandName === 'move') {
    const guild = await client.guilds.fetch(interaction.guild.id);

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

    const interactionMember = guild.members.cache.get(interaction.user.id);
    if (!interactionMember.voice.channel) {
      await interaction.reply("Tu dois être dans un salon vocal pour utiliser cette commande.");
      return;
    }
  
    if (interactionMember.voice.channel !== voiceChannel) {
      await interaction.reply("Tu n'es pas dans le même salon vocal que l'utilisateur ciblé.");
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

    await interaction.reply({content: `ça a bien marché, ${targetMember.user.username} a laché un petit pas de danse pour toi :)`, ephemeral: true});
    console.log(`${interaction.user.username} moved ${targetMember.user.username}`);
    
  }

  if (interaction.commandName === 'tour') {
    const guild = client.guilds.cache.get(interaction.guild.id);
  
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
      await interaction.reply("L'utilisateur n'est pas dans un salon vocal.");
      return;
    }
  
    const interactionMember = guild.members.cache.get(interaction.user.id);
    if (!interactionMember.voice.channel) {
      await interaction.reply("Tu dois être dans un salon vocal pour utiliser cette commande.");
      return;
    }
  
    if (interactionMember.voice.channel !== voiceChannel) {
      await interaction.reply("Tu n'es pas dans le même salon vocal que l'utilisateur ciblé.");
      return;
    }
  
    let voiceChannels;
    try {
      voiceChannels = (await guild.channels.fetch()).filter(channel => channel.isVoiceBased() && channel !== voiceChannel);
    } catch (error) {
      console.error('Error fetching channels:', error);
      return;
    }
  
    const sortedChannels = voiceChannels.sort((a, b) => a.rawPosition - b.rawPosition);
    let previousChannel;
  
    await interaction.deferReply({ ephemeral: true });

  
    for (const channel of sortedChannels.values()) {
      if (channel !== voiceChannel) {
        await targetMember.voice.setChannel(channel);
        previousChannel = channel;
  
        // Ajouter une pause de 0ms entre chaque déplacement
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
  
    // Déplacer l'utilisateur vers le salon vocal d'origine
    await targetMember.voice.setChannel(voiceChannel);
    console.log(`${interaction.user.username} a fait un tour des channels à ${targetMember.user.username}`);
  
    // Envoyer un message dans le même canal où la commande a été utilisée, visible uniquement par l'utilisateur qui a exécuté la commande
    await interaction.editReply({ content: `C'est bon, ${targetMember.user.username} a bien fait le tour des channels !`});
  } 
});
  
  


async function main() {
  const commands = [
    MoveCommand,
    TourCommand,
    NukeCommand,
  ];
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });
    client.login(TOKEN);
  } catch (err) {
    console.log(err);
  }
}

main();
