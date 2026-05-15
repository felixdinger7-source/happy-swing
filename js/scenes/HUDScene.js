export default class HUDScene extends Phaser.Scene {
  constructor() { super('HUD'); }

  init(data) {
    this._level = data.level;
    this._score = data.score;
    this._kills = data.kills;
    this._killTarget = data.killTarget;
    this._maxHp = data.maxHp;
    this._hp = data.hp;
  }

  create() {
    const { width } = this.scale;

    // hearts row
    this._hearts = [];
    for (let i = 0; i < this._maxHp; i++) {
      const h = this.add.image(16 + i * 22, 14, 'heart_full').setOrigin(0, 0).setDepth(200);
      this._hearts.push(h);
    }

    // score
    this._scoreTxt = this.add.text(width / 2, 10, this._scoreStr(), {
      fontFamily: '"Press Start 2P"',
      fontSize: '9px',
      fill: '#ffffff',
    }).setOrigin(0.5, 0).setDepth(200);

    // level + kills
    this._levelTxt = this.add.text(width - 10, 10, this._levelStr(), {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      fill: '#aaddff',
      align: 'right',
    }).setOrigin(1, 0).setDepth(200);

    // listen for updates from GameScene
    const game = this.scene.get('Game');
    game.events.on('player-hp', (hp) => {
      this._hp = hp;
      this._refreshHearts();
    }, this);
  }

  updateKills(kills, score) {
    this._kills = kills;
    this._score = score;
    this._scoreTxt.setText(this._scoreStr());
    this._levelTxt.setText(this._levelStr());
  }

  _refreshHearts() {
    for (let i = 0; i < this._hearts.length; i++) {
      this._hearts[i].setTexture(i < this._hp ? 'heart_full' : 'heart_empty');
    }
  }

  _scoreStr() {
    return `SCORE  ${String(this._score).padStart(6, '0')}`;
  }

  _levelStr() {
    return `LVL ${this._level}   ${this._kills}/${this._killTarget} KILLS`;
  }
}
