const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const consumers = require('stream/consumers');
const fs = require('fs');
const { spawn } = require('node:child_process');
const Ffmpeg = require('@ffmpeg-installer/ffmpeg');

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
                .setRequired(true),
            ),
        ),

    async execute(interaction) {

        await interaction.deferReply()
            .catch(error => console.error(error));

        const errorDefault = 'Something went wrong, try again!';
        const errorAdvice = 'If issues persist, then the desired file format might not be compatible with the uploaded attachment, or the file size might be too large for Camiki to reupload.';

        const userAttachment = interaction.options.getAttachment('from');
        const attachedURL = userAttachment.url;
        const originalFormat = userAttachment.name.split('.').slice(-1).join('');
        const wantedFormat = interaction.options.getString('to').toLowerCase();
        const finalName = `${userAttachment.name.split('.').slice(0, -1).join('')}.${wantedFormat}`;

        const pathToStore = 'Related/TempFiles/';
        const inputName = `${Date.now()}.${originalFormat}`;
        const outputName = `${Date.now()}.${wantedFormat}`;
        const inputPath = pathToStore + inputName;
        const outputPath = pathToStore + outputName;

        try {

            // Downloads the attachment
            const response = await fetch(attachedURL);
            const buffer = await consumers.buffer(response.body);
            fs.writeFileSync(inputPath, buffer);

            // Spawns a child process that runs the ffmpeg command in a shell environment
            const ffmpegProcess = spawn(Ffmpeg.path, ['-i', inputName, outputName], { cwd: pathToStore, shell: true });
            ffmpegProcess.stderr.once('data', data => {
                interaction.followUp('Your file is being converted, please be patient while it processes!');
            });
    
            ffmpegProcess.on('close', code => {

                if (code !== 0) {
                    interaction.editReply({ content: `Sorry, the conversion has failed! ${errorAdvice}` });
                    fs.unlink(inputPath, (error) => { if (error) { throw error }; });
                    return;
                };

                const convertedFile = new AttachmentBuilder().setFile(outputPath).setName(`${finalName}`);
                interaction.editReply({ content: `Here is the output file after conversion, in ${wantedFormat.toUpperCase()} format!`, files: [convertedFile] })
                    .then(response => {
                        fs.unlink(inputPath, (error) => { if (error) { throw error }; });
                        fs.unlink(outputPath, (error) => { if (error) { throw error }; });
                    })
                    .catch(error => {
                        console.error(error);
                        interaction.editReply({ content: `${errorDefault} ${errorAdvice}` });
                    });

            });

        } catch (error) {
            console.error(error);
            interaction.followUp(`${errorDefault} ${errorAdvice}`);
            fs.unlink(inputPath, (error) => { if (error) { throw error }; });
        };

    },

};