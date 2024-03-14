const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const pingEmbed = new EmbedBuilder()
    .setAuthor({
        name : 'Camiki',
        iconURL: 'https://cdn.discordapp.com/attachments/1200510427306676264/1212693699675557908/image.png'
    })
    .setColor('#ff57f6')
    .setTitle('Ping')
    .setFooter({ text: 'Have a nice day!' });

module.exports = {

    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Determine the current status of the bot.'),
    async execute(interaction) {
        const sent = await interaction.reply({ embeds: [pingEmbed
            .setDescription('Calculating ping...')], fetchReply: true });
        interaction.editReply({ embeds: [pingEmbed
            .setDescription(`${sent.createdTimestamp - interaction.createdTimestamp} ms`)
        ]});
    },
    
};