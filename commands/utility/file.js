const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const consumers = require('stream/consumers');
const fs = require('fs');
const { spawn } = require('node:child_process');
const path = require('path');

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

        interaction.deferReply()
            .catch(error => console.error(error));

        try {
            
            const pathToStore = 'Related/Files/';
            const inputName = 'input.wmv';
            const outputName = 'output.mp4';
            const inputFile = pathToStore + inputName;
            const outputFile = pathToStore + outputName;
            const userAttachment = interaction.options.getAttachment('from').url;

            let response;
            await (async () => {
                response = await fetch(userAttachment);
            })();

            const buffer = await consumers.buffer(response.body);
            fs.writeFileSync(inputFile, buffer);
            const ffmpegCommand = `ffmpeg -i ${inputFile} ${outputFile}`;
            const ffmpegProcess = spawn(ffmpegCommand, { shell: true });
    
            // I have no idea why it's stderr
            ffmpegProcess.stderr.once('data', data => {
                interaction.followUp('Your file is being converted, please be patient while it processes!')
            })
            ffmpegProcess.stderr.on('data', data => {
                console.log('Processing:', data);
            });
    
            ffmpegProcess.on('close', code => {
                if (code !== 0) {
                    console.log('Conversion failed.');
                    interaction.followUp({ content: 'Sorry, the conversion has failed!', ephemeral: true });
                } else if (code === 0) {
                    console.log('Conversion success!')
                    const convertedFile = new AttachmentBuilder().setFile(`../../Related/Files/${outputName}`);
                    interaction.followUp({ content: 'Here is the output file after conversion!', files: [convertedFile] })
                };
            });
        } catch (error) {
            console.log(error);
            interaction.followUp('Sorry, something went wrong during the download and conversion process!');
        };

    },

};