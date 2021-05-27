export const defaultQuest = {
  title: 'Treasure hunt',
  description: 'There we go',
  goals: [
    {
      type: 'denizen',
      name: 'Gavin the Goblin',
    },
    {
      type: 'encounter',
      name: 'Dead fall trap',
    },
    {
      type: 'poi',
      name: 'Wizard Tower',
    },
    {
      type: 'cache',
      name: 'Ancient artifact',
    },
  ],
  endIf: [
    {
      type: 'event',
      name: 'Trigger all event cards',
    },
    {
      type: 'lost_hp',
      name: 'Lose too much health',
      hp: 100,
    },
  ],
  tokens: [
    {
      type: 'denizen',
      id: 'goblin1',
      name: 'Goblin',
      xp: 736,
      encounter_chance: 0.3,
      position: {
        x: 0,
        y: 0,
      },
      drops: [
        {
          type: 'raw',
          name: 'Gold',
          gold: 18,
        },
        {
          type: 'weapon',
          name: 'Dagger',
          gold: 18,
        },
      ],
    },
    {
      type: 'encounter',
      title: 'dead_fall_trap',
      position: {
        x: 0,
        y: -1,
      },
    },
    {
      type: 'food',
      title: 'Berries',
      health: 1,
      position: {
        x: 0,
        y: -1,
      },
    },
    {
      type: 'food',
      title: 'Water',
      water: 1,
      position: {
        x: 1,
        y: 0,
      },
    },
    {
      type: 'raw',
      title: 'Copper',
      gold: 487,
      position: {
        x: -1,
        y: -1,
      },
    },
    {
      type: 'poi',
      title: 'Ruin',
      position: {
        x: -1,
        y: -1,
      },
    },
    {
      type: 'cache',
      title: 'Chest',
      position: {
        x: 0,
        y: 0,
      },
      items: [
        {
          type: 'raw',
          title: 'Treasure',
        },
        {
          type: 'trap',
          title: 'Pungy stick',
        },
      ],
    },
  ],
  cards: [
    {
      deck: 'encounter',
      type: 'event',
      title: 'Magical snowstorm',
    },
    {
      deck: 'encounter',
      title: '',
    },
    {
      deck: 'encounter',
      title: '',
    },
    {
      deck: 'encounter',
      title: '',
    },
  ],
}
