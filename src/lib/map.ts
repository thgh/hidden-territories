export const defaultMap = {
  terrains: [
    {
      id: 1,
      name: 'Forest',
      search: [
        {
          chance: 0.9,
          token: {
            type: 'food',
            title: 'Rabbit',
            health: 1,
            water: 1,
            position: {
              x: 0,
              y: 0,
            },
          },
        },
      ],
    },
    { id: 0, name: 'Waterway' },
    { id: 0, name: 'City/Town/Village' },
    { id: 0, name: 'Lake' },
    { id: 0, name: 'Swamp' },
    { id: 0, name: 'Hills' },
    { id: 0, name: 'Valley' },
    { id: 0, name: 'Forest' },
    { id: 0, name: 'Mountain' },
    { id: 0, name: 'Plains' },
  ],
  cells: [
    { hex: 0, x: 0, y: 0, t: 0, movement_modifier: ['road'] },
    { hex: 0, x: 0, y: 1, t: 0, movement_modifier: ['bridge'] },
    { hex: 0, x: 0, y: 2, t: 0, movement_modifier: [] },
    { hex: 0, x: 1, y: -1, t: 0, movement_modifier: [] },
    { hex: 0, x: 1, y: 0, t: 0, movement_modifier: [] },
    { hex: 0, x: 2, y: -1, t: 0, movement_modifier: [] },
    { hex: 0, x: 2, y: -2, t: 0, movement_modifier: [] },
    { hex: 0, x: 2, y: 0, t: 0, movement_modifier: [] },
    { hex: 0, x: 1, y: 1, t: 0, movement_modifier: [] },
    { hex: 0, x: 3, y: -2, t: 0, movement_modifier: [] },

    { hex: 0, x: -1, y: -1, t: 2, movement_modifier: [] },
    { hex: 0, x: -1, y: -2, t: 2, movement_modifier: [] },
    { hex: 0, x: -1, y: 0, t: 2, movement_modifier: [] },
    { hex: 0, x: -1, y: 1, t: 2, movement_modifier: [] },
    { hex: 0, x: -2, y: -1, t: 2, movement_modifier: [] },
    { hex: 0, x: -2, y: -2, t: 2, movement_modifier: [] },
    { hex: 0, x: -2, y: -3, t: 2, movement_modifier: [] },
    { hex: 0, x: -2, y: 0, t: 2, movement_modifier: [] },
    { hex: 0, x: -2, y: 1, t: 2, movement_modifier: [] },
    { hex: 0, x: -3, y: -2, t: 2, movement_modifier: [] },
    { hex: 0, x: -3, y: -3, t: 2, movement_modifier: [] },
    { hex: 0, x: 0, y: -1, t: 2, movement_modifier: [] },
    { hex: 0, x: 0, y: -2, t: 2, movement_modifier: [] },
    { hex: 0, x: 1, y: -2, t: 2, movement_modifier: [] },
    { hex: 0, x: 2, y: -3, t: 2, movement_modifier: [] },
    { hex: 0, x: 3, y: -3, t: 2, movement_modifier: [] },
    // Hex hex
    { hex: 0, x: -3, y: -1, t: 1, movement_modifier: [] },
    { hex: 0, x: -3, y: 0, t: 1, movement_modifier: [] },
    { hex: 0, x: -4, y: -1, t: 1, movement_modifier: [] },
    { hex: 0, x: -4, y: 0, t: 1, movement_modifier: [] },
    { hex: 0, x: -4, y: 1, t: 1, movement_modifier: [] },
    { hex: 0, x: -5, y: 0, t: 1, movement_modifier: [] },
    { hex: 0, x: -5, y: 1, t: 1, movement_modifier: [] },
  ],
}
