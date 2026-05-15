export const LEVELS = [
  { level: 1, killTarget: 20, spawnInterval: 2200, enemies: ['grunt'] },
  { level: 2, killTarget: 30, spawnInterval: 1800, enemies: ['grunt', 'runner'] },
  { level: 3, killTarget: 35, spawnInterval: 1500, enemies: ['grunt', 'runner', 'tank'] },
  { level: 4, killTarget: 40, spawnInterval: 1200, enemies: ['grunt', 'runner', 'tank', 'shooter'] },
  { level: 5, killTarget: 50, spawnInterval: 900,  enemies: ['grunt', 'runner', 'tank', 'shooter'], bossWave: true },
];

export const ENEMY_DEFS = {
  grunt:   { speed: 80,  hp: 2, score: 10, texture: 'enemy_grunt',   scale: 1.0 },
  runner:  { speed: 160, hp: 1, score: 15, texture: 'enemy_runner',  scale: 1.0 },
  tank:    { speed: 45,  hp: 8, score: 40, texture: 'enemy_tank',    scale: 1.0 },
  shooter: { speed: 60,  hp: 3, score: 25, texture: 'enemy_shooter', scale: 1.0 },
  boss:    { speed: 35,  hp: 30, score: 500, texture: 'enemy_tank',  scale: 2.2 },
};
