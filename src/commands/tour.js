import { SlashCommandBuilder } from '@discordjs/builders';

const tourCommand = new SlashCommandBuilder()
  .setName('tour')
  .setDescription('TOUR DES CHANNELS POUR TOI MON GARS');

  tourCommand.addUserOption((option) =>
  option.setName('user').setDescription('@ DU GARS A BOUGER').setRequired(true)
);

export default tourCommand.toJSON();
