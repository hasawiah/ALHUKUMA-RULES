const { Client, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const rules = require('./rules.json');
const fs = require('fs');
const { startServer } = require("./alive.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.once("ready", () => {
  console.log(`Bot is Ready! ${client.user.tag}`);
  console.log(`Code by Wick Studio`);
  console.log(`discord.gg/wicks`);
});


client.on('messageCreate', async message => {
  if (message.content === '!rules') {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('قائمة القوانين')
            .addOptions(rules.map(rule => ({
              label: rule.title,
              description: rule.id,
              value: rule.id,
            }))),
        );

      const embed = new MessageEmbed()
        .setColor('#f8ca3d')
        .setThumbnail('https://cdn.discordapp.com/attachments/1143228958201086015/1266861144375820299/4000.png?ex=66a6afe1&is=66a55e61&hm=8d4233604b2e8f201af670294488c6e811a9073d03a16ea6f458087182a96500&')
        .setTitle('قوانين الوزارات')
        .setDescription('**الرجاء اختيار احد القوانين لقرائتها من قائمة الاختيارات تحت**')
        .setImage('https://cdn.discordapp.com/attachments/1143228958201086015/1266861209915752539/banner_Discord.png?ex=66a6aff1&is=66a55e71&hm=41872d3f38616b48e0e9efbcc745b8059e8273870880fc12f98847744dea9f83&')
        .setFooter({ text: 'Rules Bot' })
        .setTimestamp();

      const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });
      await message.delete();
    } else {
      await message.reply({ content: "You need to be an administrator to use this command.", ephemeral: true });
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isSelectMenu()) {
    const rule = rules.find(r => r.id === interaction.values[0]);
    const text = fs.readFileSync(rule.description, 'utf-8');
    const ruleEmbed = new MessageEmbed()
      .setColor('#f8ca3d')
      .setTitle(rule.title)
      .setDescription(text)
      .setFooter({ text: 'Rules Bot' })
      .setTimestamp();

    await interaction.reply({ embeds: [ruleEmbed], ephemeral: true });
  }
});

startServer();

client.login(process.env.TOKEN);
