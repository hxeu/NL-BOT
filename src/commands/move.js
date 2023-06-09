import { SlashCommandBuilder } from '@discordjs/builders';

const moveCommand = new SlashCommandBuilder()
  .setName('move')
  .setDescription('ALLEZ HOP PETIT CON ON BOUGE');

  moveCommand.addUserOption((option) =>
  option.setName('user').setDescription('@ DU GARS A BOUGER').setRequired(true)
);

export default moveCommand.toJSON();
