export default class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    const { width, height } = this.scale;

    // scrolling floor bg
    this.bg = this.add.tileSprite(0, 0, width, height, 'floor_tile').setOrigin(0);

    // scanlines
    this._addScanlines(width, height);

    // drifting enemy silhouettes
    this.drifters = [];
    const types = ['enemy_grunt', 'enemy_runner', 'enemy_tank', 'enemy_shooter'];
    for (let i = 0; i < 12; i++) {
      const tex = types[Math.floor(Math.random() * types.length)];
      const s = this.add.image(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        tex
      ).setAlpha(0.08).setScale(Phaser.Math.FloatBetween(0.8, 2.0));
      s._vx = Phaser.Math.FloatBetween(-15, 15);
      s._vy = Phaser.Math.FloatBetween(-15, 15);
      this.drifters.push(s);
    }

    // title
    this.add.text(width / 2, height * 0.28, 'HAPPY', {
      fontFamily: '"Press Start 2P"',
      fontSize: '40px',
      fill: '#00ffff',
      stroke: '#003344',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.28 + 56, 'SWING', {
      fontFamily: '"Press Start 2P"',
      fontSize: '40px',
      fill: '#ffffff',
      stroke: '#222244',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // subtitle
    this.add.text(width / 2, height * 0.28 + 114, 'TOP-DOWN SHOOTER', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      fill: '#556677',
    }).setOrigin(0.5);

    // controls hint
    this.add.text(width / 2, height * 0.62, 'ARROWS/WASD  MOVE\nMOUSE AIM  •  CLICK SHOOT', {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      fill: '#445566',
      align: 'center',
      lineSpacing: 10,
    }).setOrigin(0.5);

    // start button
    const btn = this.add.text(width / 2, height * 0.78, '[ PRESS ENTER OR CLICK ]', {
      fontFamily: '"Press Start 2P"',
      fontSize: '11px',
      fill: '#ffee00',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: btn,
      alpha: 0.1,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    btn.on('pointerdown', () => this._startGame());
    this.input.keyboard.on('keydown-ENTER', () => this._startGame());
    this.input.keyboard.on('keydown-SPACE', () => this._startGame());
  }

  update(_, delta) {
    this.bg.tilePositionX += delta * 0.01;
    this.bg.tilePositionY += delta * 0.005;
    const { width, height } = this.scale;
    for (const d of this.drifters) {
      d.x += d._vx * (delta / 1000);
      d.y += d._vy * (delta / 1000);
      if (d.x < -60) d.x = width + 60;
      if (d.x > width + 60) d.x = -60;
      if (d.y < -60) d.y = height + 60;
      if (d.y > height + 60) d.y = -60;
    }
  }

  _startGame() {
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('Game', { level: 1, score: 0 });
    });
  }

  _addScanlines(width, height) {
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.18);
    for (let y = 0; y < height; y += 2) {
      g.fillRect(0, y, width, 1);
    }
    g.setScrollFactor(0).setDepth(100);
  }
}
