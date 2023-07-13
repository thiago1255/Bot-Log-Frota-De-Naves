const { REST, Routes, ApplicationCommandOptionType} = require('discord.js');
const { server_id } = require('./config.json');
const { bot_id } = require('./config.json');
const { token } = require('./config.json');

const commands = [
  {
    name: 'guia',
    description: 'Mostra mais informações sobre o bot e seus comandos.',
  },
  {
    name: 'criar_lista',
    description: 'Cria uma lista de naves em um canal específico.',
	options: [
      {
        name: 'titulo',
        description: 'Título da lista (ex. farmers, storages, etc.)',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'desc',
        description: 'Descrição da lista.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'cor',
        description: 'Cor da barra lateral da lista, decimal vindo de uma cor em RGB.',
        type: ApplicationCommandOptionType.Number,
        required: true,
      }
	],
  },
  {
    name: 'remover_nave',
    description: 'Remove uma nave de uma lista já existente.',
	options: [
      {
        name: 'titulo',
        description: 'Titulo da lista a ser removida.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'id_nave',
        description: 'ID da nave dentro do jogo.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
	],
  },
  {
    name: 'editar_estado',
    description: 'Edita o estado de uma nave já existente.',
	options: [
      {
        name: 'titulo',
        description: 'Titulo da lista a ser editada.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'id_nave',
        description: 'ID da nave dentro do jogo.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
	  {
        name: 'estado',
        description: 'Novo estado da nave.',
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: 'Destruída.',
            value: '🔧',
          },
          {
            name: 'Otíma.',
            value: '✅',
          },
          {
            name: 'Usável.',
            value: '☑️',
          },
          {
            name: 'Bloqueada.',
            value: '⛔️',
          },
          {
            name: 'Outro.',
            value: '❔',
          },
        ],
        required: true,
      },
	],
  },
  {
    name: 'adicionar_nave',
    description: 'Adiciona uma nave em uma lista já existente, consulte "guia" para mais informações.',
    options: [
      {
        name: 'titulo',
        description: 'Titulo da lista a ser adicionada.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'id_nave',
        description: 'ID da nave dentro do jogo.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'estado',
        description: 'Estado da nave.',
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: 'Destruída.',
            value: '🔧',
          },
          {
            name: 'Otíma.',
            value: '✅',
          },
          {
            name: 'Usável.',
            value: '☑️',
          },
          {
            name: 'Bloqueada.',
            value: '⛔️',
          },
          {
            name: 'Outro.',
            value: '❔',
          },
        ],
        required: true,
      },
      {
        name: 'tipo',
        description: 'Tipo da nave, confira o comando "guia".',
        type: ApplicationCommandOptionType.String,
        required: false,
      },
      {
        name: 'nome_nave',
        description: 'Um nome para nave, de preferencia um número de série. (Max 10 caractéres.)',
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
      console.log('🔘 Registrando comandos.');
      await rest.put(
        Routes.applicationGuildCommands(bot_id, server_id), 
	    { body: commands }
      );
      console.log('✅ Comandos registrados.');
  } catch (error) {
      console.log(`❌ Erro ao registrar comandos: ${error}`);
  }
})();
