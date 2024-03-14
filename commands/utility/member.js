const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('member')
        .setDescription('Represents a guild member on a Discord server.')
        .addSubcommand(command => command
            .setName('info')
            .setDescription('Displays information about a guild member.')
            .addUserOption(user => user
                .setName('user')
                .setDescription('The user whose information you want to retrieve.')
            )
        ),

    async execute(interaction) {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();
        
        if (subcommand === 'info') {

            const targetUser = interaction.options.getUser('user') ?? interaction.member.user;
            let targetMember = interaction.guild.members.fetch(`${targetUser.id}`)
                .then(member => targetMember = member)

            targetUser.fetch(true)
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
                        { name: 'Account Creation', value: `<t:${Date.parse(user.createdAt) / 1000}>`, inline: true },
                        { name: 'Server Join', value: `<t:${Math.trunc(targetMember.joinedTimestamp / 1000)}>`, inline: true },
                        { name: 'User ID', value: `\`${user.id}\``, inline: true }
                    );

                    const permissionsArray = targetMember;

                    interaction.reply({ embeds: [embed] });

                })

        };
    },

}