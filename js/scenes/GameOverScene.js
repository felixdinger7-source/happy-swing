export default class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }

  init(data) {
    this._score = data.score || 0;
    this._win = data.win || false;
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x000000, 0.85).setOrigin(0);

    const title = this._win ? 'YOU WIN!' : 'GAME OVER';
    const titleColor = this._win ? '#ffee00' : '#ff2244';

    this.add.text(width / 2, height * 0.30, title, {
      fontFamily: '"Press Start 2P"',
      fontSize: '34px',
      fill: titleColor,
      stroke: '#000000',
      strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.48, `FINAL SCORE`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      fill: '#888888',
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.56, String(this._score).padStart(6, '0'), {
      fontFamily: '"Press Start 2P"',
      fontSize: '22px',
      fill: '#ffffff',
    }).setOrigin(0.5);

    // RESTART
    const restart = this.add.text(width / 2 - 90, height * 0.72, '[ RESTART ]', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      fill: '#00ffcc',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    restart.on('pointerover', () => restart.setFill('#ffffff'));
    restart.on('pointerout',  () => restart.setFill('#00ffcc'));
    restart.on('pointerdown', () => {
      this.cameras.main.fadeOut(300);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('Game', { level: 1, score: 0 });
      });
    });

    // MENU
    const menu = this.add.text(width / 2 + 90, height * 0.72, '[ MENU ]', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      fill: '#aaaaaa',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    menu.on('pointerover', () => menu.setFill('#ffffff'));
    menu.on('pointerout',  () => menu.setFill('#aaaaaa'));
    menu.on('pointerdown', () => {
      this.cameras.main.fadeOut(300);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('Menu');
      });
    });

    this.cameras.main.fadeIn(500);
  }
}
