const { SlashCommandBuilder } = require("@discordjs/builders");
const roblox = require('noblox.js')
const discord = require('discord.js')
const config = require('../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`exile`)
        .setDescription(`Exile a user from your group.`)
        .addStringOption(opt => 
            opt.setName('username')
            .setDescription(`User to be exiled.`)
            .setRequired(true)
        ),
    category: "ranking",
    async execute(interaction) {
        let usera = interaction.member.user.id
        if (!config.management.administrators.find(s => s == usera) && !config.management.lowerusers.find(s => s == usera)) return interaction.reply({ content: "You are not whitelisted to use this bot's administrative functions. Contact its owner if you feel this is a mistake.", ephemeral: true})
        let group = interaction.options.getNumber('group')
        let username = interaction.options.getString('username')
        let uid = await roblox.getIdFromUsername(username).catch(err => {
            return interaction.reply({ content: 'An error occurred while getting this user\'s ID.', ephemeral: true })
        })
        let ginfo = await roblox.getGroup(group).catch(err => {
            return interaction.reply({ content: 'An error occurred while getting the group.', ephemeral: true })
        })
        await roblox.exile(group, uid).catch(err => {
            return interaction.reply({ content: 'An error occurred while kicking the user.', ephemeral: true })
        })
        let realname = await roblox.getUsernameFromId(uid)
        let iEmbed = new discord.MessageEmbed()
            .setTitle(`Success`)
            .setDescription(`${realname} has been exiled from ${ginfo.name}.`)
            .setColor('GREEN')
            .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${uID}&width=420&height=420&format=png`)
            .setTimestamp()
        interaction.reply({ embeds: [iEmbed], ephemeral: true })
    }
}