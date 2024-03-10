const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const replyMessage = new EmbedBuilder()
    .setAuthor({
        name : 'Camiki',
        iconURL: 'https://cdn.discordapp.com/attachments/1200510427306676264/1212693699675557908/image.png?ex=65f2c404&is=65e04f04&hm=e145b2c6f7e6f2cc1340d87ff93f9b60944667de378e51e87b16f37374794c6a&'
    })
    .setColor('#ff57f6')
    .setTitle('Ping')
    .setDescription('Calculating ping...')
    .setFooter({ text: 'Have a nice day!' });

const replyMessageEdited = new EmbedBuilder()
    .setAuthor({
        name : 'Camiki',
        iconURL: 'https://cdn.discordapp.com/attachments/1200510427306676264/1212693699675557908/image.png?ex=65f2c404&is=65e04f04&hm=e145b2c6f7e6f2cc1340d87ff93f9b60944667de378e51e87b16f37374794c6a&'
    })
    .setColor('#ff57f6')
    .setTitle('Ping')
    .setFooter({ text: 'Have a nice day!' });

module.exports = {

    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Determines the current status of the bot.'),
    async execute(interaction) {
        const sent = await interaction.reply({ embeds: [replyMessage], fetchReply: true });
        interaction.editReply({ embeds: [replyMessageEdited
            .setDescription(`${sent.createdTimestamp - interaction.createdTimestamp} ms`)
        ]});
    },
};