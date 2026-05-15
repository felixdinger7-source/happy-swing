export default class LevelCompleteScene extends Phaser.Scene {
  constructor() { super('LevelComplete'); }

  init(data) {
    this._level = data.level;
    this._score = data.score;
    this._isLastLevel = data.isLastLevel;
  }

  create() {
    const { width, height } = this.scale;

    // dark overlay
    this.add.rectangle(0, 0, width, height, 0x000000, 0.65).setOrigin(0).setDepth(300);

    if (this._isLastLevel) {
      this.add.text(width / 2, height * 0.35, 'YOU WIN!', {
        fontFamily: '"Press Start 2P"',
        fontSize: '36px',
        fill: '#ffee00',
        stroke: '#886600',
        strokeThickness: 6,
      }).setOrigin(0.5).setDepth(301);

      this.add.text(width / 2, height * 0.50, 'ALL ENEMIES DEFEATED', {
        fontFamily: '"Press Start 2P"',
        fontSize: '10px',
        fill: '#ffffff',
      }).setOrigin(0.5).setDepth(301);
    } else {
      this.add.text(width / 2, height * 0.35, `LEVEL ${this._level}`, {
        fontFamily: '"Press Start 2P"',
        fontSize: '30px',
        fill: '#00ffcc',
        stroke: '#003322',
        strokeThickness: 5,
      }).setOrigin(0.5).setDepth(301);

      this.add.text(width / 2, height * 0.47, 'COMPLETE!', {
        fontFamily: '"Press Start 2P"',
        fontSize: '20px',
        fill: '#ffffff',
      }).setOrigin(0.5).setDepth(301);
    }

    this.add.text(width / 2, height * 0.60, `SCORE  ${String(this._score).padStart(6, '0')}`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '11px',
      fill: '#aaaaaa',
    }).setOrigin(0.5).setDepth(301);

    if (this._isLastLevel) {
      const btn = this._makeBtn(width / 2, height * 0.74, 'MAIN MENU', () => {
        this.scene.stop('Game');
        this.scene.stop('HUD');
        this.scene.stop('LevelComplete');
        this.scene.start('Menu');
      });
    } else {
      const btn = this._makeBtn(width / 2, height * 0.74, `[ NEXT LEVEL ]`, () => {
        const nextLevel = this._level + 1;
        this.scene.get('Game').resumeNextLevel(nextLevel);
      });
    }
  }

  _makeBtn(x, y, label, cb) {
    const btn = this.add.text(x, y, label, {
      fontFamily: '"Press Start 2P"',
      fontSize: '12px',
      fill: '#ffee00',
    }).setOrigin(0.5).setDepth(302).setInteractive({ useHandCursor: true });

    this.tweens.add({ targets: btn, alpha: 0.2, duration: 500, yoyo: true, repeat: -1 });
    btn.on('pointerdown', cb);
    this.input.keyboard.once('keydown-ENTER', cb);
    this.input.keyboard.once('keydown-SPACE', cb);
    return btn;
  }
}
