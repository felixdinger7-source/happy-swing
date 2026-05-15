import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import { LEVELS } from '../config/levels.js';

const WORLD_W = 1600;
const WORLD_H = 1200;

export default class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  init(data) {
    this.levelIndex = (data.level || 1) - 1;
    this.score = data.score || 0;
    this.kills = 0;
    this._spawnTimer = 0;
    this._bossSpawned = false;
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);

    // tiled background
    this.bg = this.add.tileSprite(0, 0, WORLD_W, WORLD_H, 'floor_tile').setOrigin(0).setDepth(0);

    // particle group (reused for all death bursts)
    this.particles = this.physics.add.group({
      defaultKey: 'particle',
      maxSize: 80,
      runChildUpdate: true,
      createCallback: (p) => {
        p._life = 0;
        p.preUpdate = function(_, delta) {
          if (!this.active) return;
          this._life -= delta;
          this.setAlpha(Math.max(0, this._life / 500));
          if (this._life <= 0) { this.setActive(false).setVisible(false); this.body.reset(0,0); }
        };
      },
    });

    // enemy group
    this.enemies = this.add.group();

    // player
    this.player = new Player(this, WORLD_W / 2, WORLD_H / 2);

    // camera
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
    this.cameras.main.fadeIn(400);

    // collisions: player bullets vs enemies
    this.physics.add.overlap(
      this.player.bullets,
      this.enemies,
      (bullet, enemy) => this._onPlayerBulletHitEnemy(bullet, enemy),
      null, this
    );

    // collisions: enemies vs player
    this.physics.add.overlap(
      this.player.sprite,
      this.enemies,
      (playerSprite, enemy) => {
        if (enemy.active) this.player.takeDamage(1);
      },
      null, this
    );

    // events
    this.events.on('player-dead', () => this._onPlayerDead(), this);

    // start HUD
    this.scene.launch('HUD', {
      level: this.levelIndex + 1,
      score: this.score,
      kills: this.kills,
      killTarget: LEVELS[this.levelIndex].killTarget,
      maxHp: this.player.maxHp,
      hp: this.player.hp,
    });

    this._levelDef = LEVELS[this.levelIndex];
    this._levelComplete = false;
  }

  update(_, delta) {
    if (!this.player.alive) return;
    this.player.update(0, delta);

    // update enemies
    for (const e of this.enemies.getChildren()) {
      if (e.active) {
        e.updateAI(delta, this.player);

        // register shooter enemy bullets for overlap with player
        if (e.enemyBullets && !e._bulletsRegistered) {
          e._bulletsRegistered = true;
          this.physics.add.overlap(
            this.player.sprite,
            e.enemyBullets,
            (playerSprite, bullet) => {
              bullet.kill();
              this.player.takeDamage(1);
            },
            null, this
          );
        }
      }
    }

    // spawn
    if (!this._levelComplete) {
      this._spawnTimer -= delta;
      if (this._spawnTimer <= 0) {
        this._spawnTimer = this._levelDef.spawnInterval;
        this._spawnEnemy();
      }
      // boss wave at level 5
      if (this._levelDef.bossWave && this.kills >= this._levelDef.killTarget - 1 && !this._bossSpawned) {
        this._bossSpawned = true;
        this._spawnEnemy('boss');
      }
    }
  }

  _spawnEnemy(forceType) {
    const type = forceType || Phaser.Utils.Array.GetRandom(this._levelDef.enemies);
    const { x, y } = this._edgePosition();
    const e = new Enemy(this, x, y, type);
    this.enemies.add(e);
  }

  _edgePosition() {
    const side = Phaser.Math.Between(0, 3);
    const margin = -50;
    switch (side) {
      case 0: return { x: Phaser.Math.Between(0, WORLD_W), y: margin };
      case 1: return { x: Phaser.Math.Between(0, WORLD_W), y: WORLD_H - margin };
      case 2: return { x: margin, y: Phaser.Math.Between(0, WORLD_H) };
      case 3: return { x: WORLD_W - margin, y: Phaser.Math.Between(0, WORLD_H) };
    }
  }

  _onPlayerBulletHitEnemy(bullet, enemy) {
    if (!bullet.active || !enemy.active) return;
    bullet.kill();
    const dead = enemy.hit(1);
    if (dead) {
      this.kills++;
      this.score += enemy.score;
      enemy.die(this.particles);
      this.scene.get('HUD').updateKills(this.kills, this.score);

      if (!this._levelComplete && this.kills >= this._levelDef.killTarget) {
        this._levelComplete = true;
        this._onLevelComplete();
      }
    }
  }

  _onLevelComplete() {
    this.time.delayedCall(800, () => {
      this.scene.pause('Game');
      this.scene.launch('LevelComplete', {
        level: this.levelIndex + 1,
        score: this.score,
        isLastLevel: this.levelIndex >= LEVELS.length - 1,
      });
    });
  }

  _onPlayerDead() {
    this.time.delayedCall(1200, () => {
      this.scene.stop('HUD');
      this.scene.start('GameOver', { score: this.score, win: false });
    });
  }

  resumeNextLevel(nextLevel) {
    this.scene.stop('LevelComplete');
    this.scene.stop('HUD');
    this.scene.stop('Game');
    this.scene.start('Game', { level: nextLevel, score: this.score });
  }
}
