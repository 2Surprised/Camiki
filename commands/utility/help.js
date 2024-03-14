const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const helpEmbed = new EmbedBuilder()
    .setAuthor({
        name : 'Camiki',
        iconURL: 'https://cdn.discordapp.com/attachments/1200510427306676264/1212693699675557908/image.png'
    })
    .setColor('#ff57f6')
    .addFields(
        { name: 'Utility commands', value: '`/help`, `/ping`, `/user info`, `/role color view`, `/role color change`' },
        { name: 'Fun commands', value: '`/apod`' }
    )
    .setFooter({ text: 'Have a nice day!' });

module.exports = {

    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Find helpful information regarding Camiki.'),

    async execute(interaction) {

        helpEmbed
        .setTitle('Welcome to Camiki!')
        .setDescription('Camiki is a Discord bot created, managed, and maintained by <@871039576247005185>. As of now, Camiki is a personal hobby project, and features will come along as deemed interesting.');

        interaction.reply({ embeds: [helpEmbed] });

    }

}