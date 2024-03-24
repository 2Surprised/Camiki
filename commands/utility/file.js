const { SlashCommandBuilder } = require('discord.js')

module.exports = {

    data: new SlashCommandBuilder()
        .setName('file')
        .setDescription('Commands related to files.')
        .addSubcommand(command => command
            .setName('convert')
            .setDescription('Convert a file to another format.')
            .addAttachmentOption(attachment => attachment
                .setName('from')
                .setDescription('The file to convert.')
                .setRequired(true)
            )
            .addStringOption(string => string
                .setName('to')
                .setDescription('The format to convert the file to. (e.g. mp4)')
                .setRequired(true)
            )
        ),

    async execute(interaction) {

        interaction.reply({ content: 'Sorry, this command is still a work in progress.' })

    }

}