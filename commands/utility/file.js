const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const consumers = require('stream/consumers');
const fs = require('fs');
const { spawn } = require('node:child_process');
const path = require('path');
const { error } = require('console');

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
            const inputPath = pathToStore + inputName;
            const outputPath = pathToStore + outputName;
            const userAttachment = interaction.options.getAttachment('from').url;

            let response;
            await (async () => {
                response = await fetch(userAttachment);
            })();

            const buffer = await consumers.buffer(response.body);
            fs.writeFileSync(inputPath, buffer);
            const ffmpegCommand = `ffmpeg -i ${inputPath} ${outputPath}`;
            const ffmpegProcess = spawn(ffmpegCommand, { shell: true });
    
            // I have no idea why it's stderr
            ffmpegProcess.stderr.once('data', data => {
                interaction.followUp('Your file is being converted, please be patient while it processes!')
            })
            // ffmpegProcess.stderr.on('data', data => {
            //     console.log('Processing:', data);
            // });
    
            ffmpegProcess.on('close', code => {
                if (code !== 0) {
                    interaction.editReply({ content: 'Sorry, the conversion has failed!' });
                } else if (code === 0) {
                    const convertedFile = new AttachmentBuilder().setFile(outputPath);
                    interaction.editReply({ content: 'Here is the output file after conversion!', files: [convertedFile] })
                        .then(response => {
                            fs.unlink(inputPath, (error) => { if (error) throw error; });
                            fs.unlink(outputPath, (error) => { if (error) throw error; });
                        })
                };
            });
        } catch (error) {
            console.log(error);
            interaction.followUp('Sorry, something went wrong during the download and conversion process!');
        };

    },

};