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
  console.log(`✅ ${c.user.tag} está online !`);
});
//-------------------------------------------------------------------------------------------------------------------------
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (!interaction.member.roles.cache.has(role_id)) return interaction.reply('Permissão negada !');
//-------------------------------------------------------------------------------------------------------------------------
  if (interaction.commandName === 'criar_lista') {
      const titulo = interaction.options.get('titulo');
      const cor = interaction.options.get('cor');
      const desc = interaction.options.get('desc');
      if(cor.value > 16777215) {return interaction.reply('Cor não pode exceder 16777215.');}
      const embed = new EmbedBuilder().setTitle(titulo.value).setColor(cor.value).setDescription(desc.value).setFooter({text: footer});
      client.channels.cache.get(channel_id).send({ embeds: [embed] });
	  console.log(`⚠️ Criada nova lista por: ${interaction.member.user.tag}`);
	  return interaction.reply(`Lista criada em: <#${channel_id}>`);
//-------------------------------------------------------------------------------------------------------------------------
  } else if (interaction.commandName === 'adicionar_nave') {
      const id_nave = interaction.options.get('id_nave');
      const nome_nave = interaction.options.get('nome_nave');
      const tipo = interaction.options.get('tipo');
      const titulo = interaction.options.get('titulo');
      if(id_nave.length >= 8 || nome_nave?.length > 10 || tipo?.length >= 12){return interaction.reply('ID, Nome ou Tipo muíto grande !');}
      const estado = interaction.options.get('estado');
	
      try {
        const mensagems = await client.channels.cache.get(channel_id).messages.fetch();
		const mensagem = mensagems.find((msg) => msg.author.id === bot_id && msg.embeds.length > 0 && msg.embeds[0].title === titulo.value);
		if(!mensagem) {return interaction.reply(`Não existe uma lista com o título ${titulo.value}.`); }
        const embedAnterior = mensagem.embeds[0];
        const embedAtual = EmbedBuilder.from(embedAnterior).addFields({ 
          name: id_nave.value, 
          value: `*${nome_nave?nome_nave.value:''}* **${tipo?tipo.value:''}** ${estado.value}`, 
          inline: false 
        });
        await mensagem.delete();
        client.channels.cache.get(channel_id).send({ embeds: [embedAtual] });
		console.log(`⚠️ Adicionada nave ID "${id_nave.value}" estado "${estado.value}" por: ${interaction.member.user.tag}`);
        return interaction.reply(`Adicionada nave com ID ${id_nave.value}.`);
      } catch(error) {
        return interaction.reply(`Erro: ${error}`);
      }
//-------------------------------------------------------------------------------------------------------------------------
  } else if (interaction.commandName === 'remover_nave') {
      const id_nave = interaction.options.get('id_nave');
      const titulo = interaction.options.get('titulo');
	
      try {
        const mensagems = await client.channels.cache.get(channel_id).messages.fetch();
		const mensagem = mensagems.find((msg) => msg.author.id === bot_id && msg.embeds.length > 0 && msg.embeds[0].title === titulo.value);
		if(!mensagem) {return interaction.reply(`Não existe uma lista com o título ${titulo.value}.`); }
        const embedAnterior = mensagem.embeds[0];
        const embedAtual = {title: embedAnterior.title}; embedAtual.color = embedAnterior.color; embedAtual.description = embedAnterior.description; embedAtual.footer = embedAnterior.footer;
        embedAtual.fields = embedAnterior.fields.filter(item => item.name != id_nave.value);
        await mensagem.delete();
        client.channels.cache.get(channel_id).send({ embeds: [embedAtual] });
		console.log(`⚠️ Removida nave ID "${id_nave.value}" por: ${interaction.member.user.tag}`);
        return interaction.reply(`Removido o ID ${id_nave.value} da lista.`);
      } catch(error) {
        return interaction.reply(`Erro: ${error}`);
      }
//-------------------------------------------------------------------------------------------------------------------------
  } else if (interaction.commandName === 'editar_estado') {
      const id_nave = interaction.options.get('id_nave');
      const titulo = interaction.options.get('titulo');
	  const estado = interaction.options.get('estado');
	
      try {
        const mensagems = await client.channels.cache.get(channel_id).messages.fetch();
		const mensagem = mensagems.find((msg) => msg.author.id === bot_id && msg.embeds.length > 0 && msg.embeds[0].title === titulo.value);
		if(!mensagem) { return interaction.reply(`Não existe uma lista com o título ${titulo.value}.`); }
        const embedAnterior = mensagem.embeds[0];
		const embedIntermediario = {title: embedAnterior.title}; embedIntermediario.color = embedAnterior.color; embedIntermediario.description = embedAnterior.description; embedIntermediario.footer = embedAnterior.footer;
		embedIntermediario.fields = embedAnterior.fields.filter(item => item.name != id_nave.value);
		const fieldAeditar = embedAnterior.fields.find(item => item.name === id_nave.value);
		if(fieldAeditar.length === 0) { return interaction.reply(`Não existe uma nave com ID ${id_nave.value}.`); }
		const embedAtual = EmbedBuilder.from(embedIntermediario).addFields({ 
          name: fieldAeditar.name, 
          value: fieldAeditar.value.replace(/🔧|✅|☑️|⛔️|❔/g, estado.value), 
          inline: false 
        });
		await mensagem.delete();
        client.channels.cache.get(channel_id).send({ embeds: [embedAtual] });
		console.log(`⚠️ Editado o estado da nave ID "${id_nave.value}" para "${estado.value}" por: ${interaction.member.user.tag}`);
        return interaction.reply(`Mudado o estado na nave ID ${id_nave.value}.`);
      } catch(error) {
        return interaction.reply(`Erro: ${error}`);
      }
//-------------------------------------------------------------------------------------------------------------------------
  } else if (interaction.commandName === 'guia') {
      return interaction.reply(`Para criar uma lista use o comando *criar_lista*, para adicionar uma nave nessa lista, use o comando *adicionar_nave*, tipo e nome são opcionais. (Nome é apenas um outro modo de identificar a nave, no tipo, a formatação "Uso-Munição-Tamanho-Extra" dever ser usada.) Para remover uma nave, use o comando *remover_nave* junto com o ID da nave a ser removido, lembre-se que todos os itens na lista selecionada, com aquele id, serão removidos. Para editar o estado da nave use o comando *editar_estado*, para editar outras informações, remova-a e re-adicione-a. **NOTA: O bot está configurado para operar somente no canal <#${channel_id}>, todas as informações são registradas.**`);
  }
});
//-------------------------------------------------------------------------------------------------------------------------
client.login(token);
