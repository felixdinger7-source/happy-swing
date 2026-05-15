export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setActive(false).setVisible(false);
  }

  fire(x, y, angle, speed) {
    this.setActive(true).setVisible(true);
    this.setPosition(x, y);
    this.body.reset(x, y);
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    this.setVelocity(vx, vy);
    this._life = 2000;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (!this.active) return;
    this._life -= delta;
    if (this._life <= 0) this.kill();
    // kill if out of world bounds
    const b = this.scene.physics.world.bounds;
    if (this.x < b.x - 60 || this.x > b.right + 60 ||
        this.y < b.y - 60 || this.y > b.bottom + 60) {
      this.kill();
    }
  }

  kill() {
    this.setActive(false).setVisible(false);
    this.body.reset(0, 0);
  }
}
