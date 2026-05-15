import { ENEMY_DEFS } from '../config/levels.js';
import Bullet from './Bullet.js';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    const def = ENEMY_DEFS[type];
    super(scene, x, y, def.texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.type = type;
    this.def = def;
    this.hp = def.hp;
    this.score = def.score;
    this.setScale(def.scale);
    this.setDepth(8);
    this.setCircle(
      Math.floor((this.width * def.scale) / 2.4),
      Math.floor(this.width / 2 - (this.width * def.scale) / 2.4),
      Math.floor(this.height / 2 - (this.width * def.scale) / 2.4)
    );

    // shooter bullet pool
    if (type === 'shooter') {
      this._shootCooldown = 2000;
      this._shootTimer = Phaser.Math.Between(800, 2000);
      this.enemyBullets = scene.physics.add.group({
        classType: Bullet,
        maxSize: 10,
        runChildUpdate: true,
        createCallback: (b) => b.setTexture('bullet_enemy'),
      });
    }

    this._zigzagTimer = 0;
    this._zigzagOffset = 0;
    this._flashTimer = 0;
  }

  updateAI(delta, player) {
    if (!this.active || !player.alive) return;

    const px = player.x, py = player.y;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, px, py);
    const dist = Phaser.Math.Distance.Between(this.x, this.y, px, py);

    switch (this.type) {
      case 'grunt':
        this.scene.physics.velocityFromAngle(
          Phaser.Math.RadToDeg(angle), this.def.speed, this.body.velocity
        );
        break;

      case 'runner': {
        this._zigzagTimer += delta;
        if (this._zigzagTimer > 400) {
          this._zigzagTimer = 0;
          this._zigzagOffset = Phaser.Math.Between(-60, 60);
        }
        const perpAngle = angle + Math.PI / 2;
        const vx = Math.cos(angle) * this.def.speed + Math.cos(perpAngle) * this._zigzagOffset;
        const vy = Math.sin(angle) * this.def.speed + Math.sin(perpAngle) * this._zigzagOffset;
        this.setVelocity(vx, vy);
        break;
      }

      case 'tank':
        this.scene.physics.velocityFromAngle(
          Phaser.Math.RadToDeg(angle), this.def.speed, this.body.velocity
        );
        break;

      case 'shooter': {
        const preferred = 260;
        if (dist > preferred + 30) {
          this.scene.physics.velocityFromAngle(
            Phaser.Math.RadToDeg(angle), this.def.speed, this.body.velocity
          );
        } else if (dist < preferred - 30) {
          this.scene.physics.velocityFromAngle(
            Phaser.Math.RadToDeg(angle + Math.PI), this.def.speed, this.body.velocity
          );
        } else {
          this.setVelocity(0, 0);
        }

        this._shootTimer -= delta;
        if (this._shootTimer <= 0) {
          this._shootTimer = this._shootCooldown;
          const b = this.enemyBullets.get(this.x, this.y, 'bullet_enemy');
          if (b) b.fire(this.x, this.y, angle, 220);
        }
        break;
      }
    }

    // rotate to face player
    this.setRotation(angle + Math.PI / 2);

    // flash on hit
    if (this._flashTimer > 0) {
      this._flashTimer -= delta;
      this.setTint(0xffffff);
    } else {
      this.clearTint();
    }
  }

  hit(damage = 1) {
    this.hp -= damage;
    this._flashTimer = 80;
    return this.hp <= 0;
  }

  die(particles) {
    // burst particles
    const colors = { grunt: 0xff3333, runner: 0xff8800, tank: 0x9933ff, shooter: 0xffee00, boss: 0x9933ff };
    const col = colors[this.type] || 0xffffff;
    const count = this.type === 'tank' || this.type === 'boss' ? 12 : 6;
    for (let i = 0; i < count; i++) {
      const p = particles.get(this.x, this.y, 'particle');
      if (!p) continue;
      p.setActive(true).setVisible(true).setTint(col).setScale(Phaser.Math.FloatBetween(0.5, 2));
      p.body.reset(this.x, this.y);
      const a = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const spd = Phaser.Math.FloatBetween(60, 200);
      p.setVelocity(Math.cos(a) * spd, Math.sin(a) * spd);
      p._life = 500;
    }

    if (this.enemyBullets) this.enemyBullets.destroy(true);
    this.destroy();
  }
}
