const { SlashCommandBuilder } = require('discord.js')

module.exports = {

    data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Commands related to roles.')
    .addSubcommandGroup(commandGroup => commandGroup
        .setName('color')
        .setDescription('Commands related to role colors.')
        .addSubcommand(command => command
            .setName('view')
            .setDescription('View your current role color.'))
        .addSubcommand(command => command
            .setName('change')
            .setDescription('Change your current role color.'))
    ),

    async execute(interaction) {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();

        if (subcommandGroup === 'color') {
            if (subcommand === 'view') {
                // Stopped here
            } else if (subcommand === 'change') {

            }
        }
    }

}