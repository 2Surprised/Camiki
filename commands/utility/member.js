const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('member')
        .setDescription('Represents a guild member on a Discord server.')
        .addSubcommand(command => command
            .setName('info')
            .setDescription('Displays information about a guild member.')
        ),

    async execute(interaction) {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'info') {

            interaction.member.user.fetch(true)
                .then(user => {

                    const embed = new EmbedBuilder()
                    .setAuthor({
                        name : 'Camiki',
                        iconURL: 'https://cdn.discordapp.com/attachments/1200510427306676264/1212693699675557908/image.png'
                    })
                    .setFooter({ text: 'Have a nice day!' })
                    .setColor(user.hexAccentColor)
                    .setTitle('User Information')
                    .setDescription(`${user} is a member of **${interaction.guild.name}**!`)
                    .setThumbnail(user.avatarURL())
                    .setImage(user.bannerURL())
                    .addFields(
                        { name: 'Account Creation', value: user.createdAt, inline: true },
                        { name: 'Server Join', value: interaction.member.joinedAt, inline: true },
                        { name: 'User ID', value: user.id, inline: true }
                    )

                    interaction.reply({ embeds: [embed] })

                })

        };
    },

}