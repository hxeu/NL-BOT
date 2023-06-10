import { SlashCommandBuilder } from '@discordjs/builders';

const nukeCommand = new SlashCommandBuilder()
  .setName('nuke')
  .setDescription('NE PAS UTILISER ❌❌❌');

export default nukeCommand.toJSON();