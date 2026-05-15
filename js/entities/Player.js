import Bullet from './Bullet.js';

const SPEED = 200;
const SHOOT_COOLDOWN = 250;
const MAX_HP = 5;
const INVINCIBLE_MS = 700;
const BULLET_SPEED = 520;

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.hp = MAX_HP;
    this.maxHp = MAX_HP;
    this.alive = true;
    this._shootTimer = 0;
    this._invTimer = 0;
    this._invincible = false;
    this._bobDir = 1;
    this._bobAmt = 0;

    // physics sprite for body
    this.sprite = scene.physics.add.sprite(x, y, 'player_body');
    this.sprite.setCircle(12, 4, 8);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(10);

    // gun as child image (no physics needed)
    this.gun = scene.add.image(x, y, 'player_gun').setOrigin(0, 0.5).setDepth(11);

    // bullet group
    this.bullets = scene.physics.add.group({
      classType: Bullet,
      maxSize: 40,
      runChildUpdate: true,
      createCallback: (b) => b.setTexture('bullet_player'),
    });

    // input
    this.keys = scene.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.UP,
      down:  Phaser.Input.Keyboard.KeyCodes.DOWN,
      left:  Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    });

    scene.input.on('pointerdown', (ptr) => {
      if (ptr.leftButtonDown()) this._tryShoot();
    });
  }

  update(time, delta) {
    if (!this.alive) return;

    this._handleMovement();
    this._handleAim();
    this._handleInvincibility(delta);

    // bob when moving
    const moving = this.sprite.body.velocity.lengthSq() > 100;
    if (moving) {
      this._bobAmt += delta * 0.018 * this._bobDir;
      if (Math.abs(this._bobAmt) > 2) this._bobDir *= -1;
    } else {
      this._bobAmt *= 0.8;
    }
    this.sprite.y += this._bobAmt * 0.1;

    this._shootTimer = Math.max(0, this._shootTimer - delta);
  }

  _handleMovement() {
    const k = this.keys;
    let vx = 0, vy = 0;
    if (k.left.isDown  || k.a.isDown) vx = -1;
    if (k.right.isDown || k.d.isDown) vx =  1;
    if (k.up.isDown    || k.w.isDown) vy = -1;
    if (k.down.isDown  || k.s.isDown) vy =  1;
    if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }
    this.sprite.setVelocity(vx * SPEED, vy * SPEED);
  }

  _handleAim() {
    const ptr = this.scene.input.activePointer;
    const wx = this.scene.cameras.main.scrollX + ptr.x;
    const wy = this.scene.cameras.main.scrollY + ptr.y;
    const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, wx, wy);
    this.gun.setPosition(this.sprite.x, this.sprite.y);
    this.gun.setRotation(angle);
    // flip body if aiming left
    this.sprite.setFlipX(wx < this.sprite.x);
  }

  _tryShoot() {
    if (!this.alive || this._shootTimer > 0) return;
    this._shootTimer = SHOOT_COOLDOWN;

    const ptr = this.scene.input.activePointer;
    const wx = this.scene.cameras.main.scrollX + ptr.x;
    const wy = this.scene.cameras.main.scrollY + ptr.y;
    const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, wx, wy);

    // spawn from gun tip
    const gx = this.sprite.x + Math.cos(angle) * 20;
    const gy = this.sprite.y + Math.sin(angle) * 20;

    const b = this.bullets.get(gx, gy, 'bullet_player');
    if (b) b.fire(gx, gy, angle, BULLET_SPEED);
  }

  _handleInvincibility(delta) {
    if (!this._invincible) return;
    this._invTimer -= delta;
    this.sprite.setAlpha(Math.sin(this._invTimer * 0.03) > 0 ? 1 : 0.3);
    if (this._invTimer <= 0) {
      this._invincible = false;
      this.sprite.setAlpha(1);
    }
  }

  takeDamage(amount = 1) {
    if (this._invincible || !this.alive) return;
    this.hp -= amount;
    this._invincible = true;
    this._invTimer = INVINCIBLE_MS;
    this.scene.cameras.main.shake(200, 0.012);
    this.scene.events.emit('player-hp', this.hp);
    if (this.hp <= 0) {
      this.alive = false;
      this.sprite.setAlpha(0);
      this.gun.setAlpha(0);
      this.scene.events.emit('player-dead');
    }
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }

  destroy() {
    this.sprite.destroy();
    this.gun.destroy();
    this.bullets.destroy(true);
  }
}
