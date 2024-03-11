const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const embed = new EmbedBuilder()
    .setAuthor({
        name : 'Camiki',
        iconURL: 'https://cdn.discordapp.com/attachments/1200510427306676264/1212693699675557908/image.png'
    })
    .setColor('#ff57f6')
    .setFooter({ text: 'Have a nice day!' });

module.exports = {

    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Find helpful information regarding Camiki.'),

    async execute(interaction) {

        embed
        .setTitle('Welcome to Camiki!')
        .setDescription('Camiki is a Discord bot created, managed, and maintained by <@871039576247005185>. As of now, Camiki is a personal hobby project, and features will come along as deemed interesting.')
        .addFields(
            { name: 'Utility commands', value: '`/help`, `/ping`, `/role color view`, `/role color change`' }
        )
        interaction.reply({ embeds: [embed] })

    }

}