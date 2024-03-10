const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Jimp = require('jimp');

function decimalToHexColor(decimal) {
    var hex = Number(decimal).toString(16);
    hex = "#000000".substring(0, 7 - hex.length) + hex;
    return hex;
}

const embed = new EmbedBuilder()
    .setAuthor({
        name : 'Camiki',
        iconURL: 'https://cdn.discordapp.com/attachments/1200510427306676264/1212693699675557908/image.png?ex=65f2c404&is=65e04f04&hm=e145b2c6f7e6f2cc1340d87ff93f9b60944667de378e51e87b16f37374794c6a&'
    })
    .setColor('#ff57f6')
    .setFooter({ text: 'Have a nice day!' });

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
            .setDescription('Change your current role color.')
            .addStringOption(option => option
                .setName('color')
                .setDescription('The HEX value of your new role color')
                .setRequired(true)
            ))
    ),

    async execute(interaction) {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();

        if (subcommandGroup === 'color') {
            if (subcommand === 'view') {

                // let roleColorImageObject = new Jimp(256, 256, decimalToHexColor(interaction.member.roles.color.color), (error, image) => {
                //     if (error) throw error;
                //     roleColorImageObject = image.getBufferAsync(Jimp.MIME_PNG)
                //     // .then(result => roleColorImageObject = result);
                // });
                // const roleColorImage = new AttachmentBuilder()
                // .setFile(roleColorImageObject, 'roleColorImage')
                // const replyEmbed = embed
                // .setTitle('Current role color')
                // .setImage('attachment://roleColorImage');
                
                // // interaction.reply({ embeds: [replyEmbed], files: [{ attachment: roleColorImageObject.bitmap.data, name: 'roleColorImage'}] });
                // interaction.reply({ content: "Test", files: [{ attachment: roleColorImageObject }] })

                async function imageCreate() {
                    new Jimp(256, 256, "#FF00FF", (error, image) => {
                        if (error) throw error;
                        image.getBuffer(Jimp.MIME_PNG, (error, buffer) => {
                            if (error) throw error;
                            return buffer;
                        });
                    });
                }

                console.log(imageCreate())
                console.log(Buffer.isBuffer(imageCreate()))
                
                // interaction.reply({ content: "Test", files: [{ attachment: imageBuffer, name: "image" }] });

            } else if (subcommand === 'change') {

                interaction.member.roles.color.setColor(`${interaction.options.getString('color')}`)
                .catch(console.error);
                interaction.reply({ content: "Your role color has been successfully changed!" });

            };
        };
    },

};