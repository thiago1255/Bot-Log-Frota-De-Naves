const { REST, Routes, ApplicationCommandOptionType} = require('discord.js');
const { server_id } = require('./config.json');
const { bot_id } = require('./config.json');
const { token } = require('./config.json');

const commands = [
  {
    name: 'guide',
    description: 'Show more information about the bot and its commands.',
  },
  {
    name: 'create_list',
    description: 'Create a list of ships in a specific channel.',
	options: [
      {
        name: 'title',
        description: 'List title (e.g., farmers, storages, etc.)',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'desc',
        description: 'List description.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'color',
        description: 'Sidebar color of the list, decimal derived from an RGB color.',
        type: ApplicationCommandOptionType.Number,
        required: true,
      }
	],
  },
  {
    name: 'remove_ship',
    description: 'Remove a ship from an existing list.',
	options: [
      {
        name: 'title',
        description: 'Title of the list to be removed.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'ship_id',
        description: 'ID of the ship inside the game.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
	],
  },
  {
    name: 'edit_status',
    description: 'Edit the status of an existing ship.',
	options: [
      {
        name: 'title',
        description: 'Title of the list to be edited.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'ship_id',
        description: 'In-game ship ID.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
	  {
        name: 'status',
        description: 'New ship status.',
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: 'Destroyed.',
            value: '🔧',
          },
          {
            name: 'Great.',
            value: '✅',
          },
          {
            name: 'Usable.',
            value: '☑️',
          },
          {
            name: 'Blocked.',
            value: '⛔️',
          },
          {
            name: 'Other.',
            value: '❔',
          },
        ],
        required: true,
      },
	],
  },
  {
    name: 'add_ship',
    description: 'Add a ship to an existing list, refer to "guide" for more information.',
    options: [
      {
        name: 'title',
        description: 'Title of the list to be added.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'ship_id',
        description: 'In-game ship ID.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'status',
        description: 'Ship status.',
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: 'Destroyed.',
            value: '🔧',
          },
          {
            name: 'Great.',
            value: '✅',
          },
          {
            name: 'Usable.',
            value: '☑️',
          },
          {
            name: 'Blocked.',
            value: '⛔️',
          },
          {
            name: 'Other.',
            value: '❔',
          },
        ],
        required: true,
      },
      {
        name: 'type',
        description: 'Ship type, check the "guide" command.',
        type: ApplicationCommandOptionType.String,
        required: false,
      },
      {
        name: 'ship_name',
        description: 'A name for the ship, preferably a serial number. (Max 10 characters.)',
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
      console.log('🔘 Registering commands.');
      await rest.put(
        Routes.applicationGuildCommands(bot_id, server_id), 
	    { body: commands }
      );
      console.log('✅ Commands registered.');
  } catch (error) {
      console.log(`❌ Error while registering commands: ${error}`);
  }
})();
