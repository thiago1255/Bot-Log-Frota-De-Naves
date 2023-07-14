const { Client, IntentsBitField, EmbedBuilder} = require('discord.js');
const { token } = require('./config.json');
const { bot_id } = require('./config.json');
const { role_id } = require('./config.json');
const { channel_id } = require('./config.json');
const { footer } = require('./config.json');
//-------------------------------------------------------------------------------------------------------------------------
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});
//-------------------------------------------------------------------------------------------------------------------------
client.on('ready', (c) => {
  console.log(`✅ ${c.user.tag} is online !`);
});
//-------------------------------------------------------------------------------------------------------------------------
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (!interaction.member.roles.cache.has(role_id)) return interaction.reply('Permission denied !');
//-------------------------------------------------------------------------------------------------------------------------
  if (interaction.commandName === 'create_list') {
      const title = interaction.options.get('title');
      const color = interaction.options.get('color');
      const desc = interaction.options.get('desc');
      if(color.value > 16777215) {return interaction.reply('Color cannot exceed 16777215.');}
      const embed = new EmbedBuilder().setTitle(title.value).setColor(color.value).setDescription(desc.value).setFooter({text: footer});
      client.channels.cache.get(channel_id).send({ embeds: [embed] });
	  console.log(`⚠️ New list created by: ${interaction.member.user.tag}`);
	  return interaction.reply(`List created on: <#${channel_id}>`);
//-------------------------------------------------------------------------------------------------------------------------
  } else if (interaction.commandName === 'add_ship') {
      const ship_id = interaction.options.get('ship_id');
      const ship_name = interaction.options.get('ship_name');
      const type = interaction.options.get('type');
      const title = interaction.options.get('title');
      if(ship_id.length >= 8 || ship_name?.length > 10 || type?.length >= 12){return interaction.reply('ID, Name, or Type too long !');}
      const status = interaction.options.get('status');
	
      try {
        const mensagems = await client.channels.cache.get(channel_id).messages.fetch();
		const mensagem = mensagems.find((msg) => msg.author.id === bot_id && msg.embeds.length > 0 && msg.embeds[0].title === title.value);
		if(!mensagem) {return interaction.reply(`There is no list with the title ${title.value}.`); }
        const embedAnterior = mensagem.embeds[0];
        const embedAtual = EmbedBuilder.from(embedAnterior).addFields({ 
          name: ship_id.value, 
          value: `*${ship_name?ship_name.value:''}* **${type?type.value:''}** ${status.value}`, 
          inline: false 
        });
        await mensagem.delete();
        client.channels.cache.get(channel_id).send({ embeds: [embedAtual] });
		console.log(`⚠️ Added ship ID "${ship_id.value}" status "${status.value}" by: ${interaction.member.user.tag}`);
        return interaction.reply(`Added ship with ID ${ship_id.value}.`);
      } catch(error) {
        return interaction.reply(`Error: ${error}`);
      }
//-------------------------------------------------------------------------------------------------------------------------
  } else if (interaction.commandName === 'remove_ship') {
      const ship_id = interaction.options.get('ship_id');
      const title = interaction.options.get('title');
	
      try {
        const mensagems = await client.channels.cache.get(channel_id).messages.fetch();
		const mensagem = mensagems.find((msg) => msg.author.id === bot_id && msg.embeds.length > 0 && msg.embeds[0].title === title.value);
		if(!mensagem) {return interaction.reply(`There is no list with the title ${title.value}.`); }
        const embedAnterior = mensagem.embeds[0];
        const embedAtual = {title: embedAnterior.title}; embedAtual.color = embedAnterior.color; embedAtual.description = embedAnterior.description; embedAtual.footer = embedAnterior.footer;
        embedAtual.fields = embedAnterior.fields.filter(item => item.name != ship_id.value);
        await mensagem.delete();
        client.channels.cache.get(channel_id).send({ embeds: [embedAtual] });
		console.log(`⚠️ Removida nave ID "${ship_id.value}" by: ${interaction.member.user.tag}`);
        return interaction.reply(`Removed ID ${ship_id.value} from the list.`);
      } catch(error) {
        return interaction.reply(`Error: ${error}`);
      }
//-------------------------------------------------------------------------------------------------------------------------
  } else if (interaction.commandName === 'edit_status') {
      const ship_id = interaction.options.get('ship_id');
      const title = interaction.options.get('title');
	  const status = interaction.options.get('status');
	
      try {
        const mensagems = await client.channels.cache.get(channel_id).messages.fetch();
		const mensagem = mensagems.find((msg) => msg.author.id === bot_id && msg.embeds.length > 0 && msg.embeds[0].title === title.value);
		if(!mensagem) { return interaction.reply(`There is no list with the title ${title.value}.`); }
        const embedAnterior = mensagem.embeds[0];
		const embedIntermediario = {title: embedAnterior.title}; embedIntermediario.color = embedAnterior.color; embedIntermediario.description = embedAnterior.description; embedIntermediario.footer = embedAnterior.footer;
		embedIntermediario.fields = embedAnterior.fields.filter(item => item.name != ship_id.value);
		const fieldAeditar = embedAnterior.fields.find(item => item.name === ship_id.value);
		if(fieldAeditar.length === 0) { return interaction.reply(`There is no ship with ID ${ship_id.value}.`); }
		const embedAtual = EmbedBuilder.from(embedIntermediario).addFields({ 
          name: fieldAeditar.name, 
          value: fieldAeditar.value.replace(/🔧|✅|☑️|⛔️|❔/g, status.value), 
          inline: false 
        });
		await mensagem.delete();
        client.channels.cache.get(channel_id).send({ embeds: [embedAtual] });
		console.log(`⚠️ Edited the status of ship ID "${ship_id.value}" to "${status.value}" by: ${interaction.member.user.tag}`);
        return interaction.reply(`Changed the status of ship ID ${ship_id.value}.`);
      } catch(error) {
        return interaction.reply(`Error: ${error}`);
      }
//-------------------------------------------------------------------------------------------------------------------------
  } else if (interaction.commandName === 'guia') {
      return interaction.reply(`To create a list, use the command *create_list*. To add a ship to this list, use the command *add_ship*. "Type" and "name" are optional. (Name is just another way to identify the ship, and in the "type" field, the format "Usage-Ammo-Size-Extra" should be used.) To remove a ship, use the command *remove_ship* along with the ID of the ship to be removed. Remember that all items in the selected list with that ID will be removed. To edit the ship's status, use the command *edit_status*. To edit other information, remove and re-add it. **NOTE: The bot is configured to operate only in the <#${channel_id}> channel, and all information is logged.**`);
  }
});
//-------------------------------------------------------------------------------------------------------------------------
client.login(token);
