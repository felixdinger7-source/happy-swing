export default class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    this._makeFloorTile();
    this._makePlayerBody();
    this._makePlayerGun();
    this._makeEnemyGrunt();
    this._makeEnemyRunner();
    this._makeEnemyTank();
    this._makeEnemyShooter();
    this._makeBullets();
    this._makeHearts();
    this._makeParticle();
    this.scene.start('Menu');
  }

  _makeFloorTile() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x111118);
    g.fillRect(0, 0, 32, 32);
    g.lineStyle(1, 0x1e1e2e, 1);
    g.strokeRect(0, 0, 32, 32);
    g.generateTexture('floor_tile', 32, 32);
    g.destroy();
  }

  _makePlayerBody() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // legs
    g.fillStyle(0x334455);
    g.fillRect(10, 22, 5, 10);
    g.fillRect(17, 22, 5, 10);
    // body
    g.fillStyle(0x4488cc);
    g.fillRect(8, 13, 16, 11);
    // head
    g.fillStyle(0xffcc99);
    g.fillCircle(16, 9, 8);
    // visor
    g.fillStyle(0x88ddff);
    g.fillRect(11, 6, 10, 4);
    // highlight
    g.fillStyle(0x66aaee);
    g.fillRect(8, 13, 16, 2);
    g.generateTexture('player_body', 32, 32);
    g.destroy();
  }

  _makePlayerGun() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x888899);
    g.fillRect(0, 1, 20, 4);
    g.fillStyle(0xaaaacc);
    g.fillRect(0, 1, 6, 4);
    g.fillStyle(0x555566);
    g.fillRect(16, 0, 4, 6);
    g.generateTexture('player_gun', 20, 6);
    g.destroy();
  }

  _makeEnemyGrunt() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xcc2222);
    g.fillRect(2, 2, 24, 24);
    g.fillStyle(0xff4444);
    g.fillRect(2, 2, 24, 6);
    g.fillStyle(0x881111);
    g.fillRect(2, 20, 24, 6);
    g.fillStyle(0xff6666);
    g.fillRect(4, 8, 4, 4);
    g.fillRect(20, 8, 4, 4);
    g.generateTexture('enemy_grunt', 28, 28);
    g.destroy();
  }

  _makeEnemyRunner() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xff8800);
    g.fillTriangle(11, 0, 0, 22, 22, 22);
    g.fillStyle(0xffaa33);
    g.fillTriangle(11, 3, 3, 19, 19, 19);
    g.fillStyle(0xffcc66);
    g.fillRect(9, 10, 4, 4);
    g.generateTexture('enemy_runner', 22, 22);
    g.destroy();
  }

  _makeEnemyTank() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // hexagon
    g.fillStyle(0x6633aa);
    g.fillRect(10, 0, 20, 40);
    g.fillRect(0, 10, 40, 20);
    g.fillRect(4, 4, 32, 32);
    g.fillStyle(0x8844cc);
    g.fillRect(10, 2, 20, 8);
    g.fillStyle(0x441177);
    g.fillRect(10, 30, 20, 8);
    g.fillStyle(0xaa66ee);
    g.fillRect(12, 8, 16, 4);
    g.generateTexture('enemy_tank', 40, 40);
    g.destroy();
  }

  _makeEnemyShooter() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // diamond
    g.fillStyle(0xddcc00);
    g.fillTriangle(13, 0, 0, 13, 13, 26);
    g.fillTriangle(13, 0, 26, 13, 13, 26);
    g.fillStyle(0xffee33);
    g.fillTriangle(13, 3, 3, 13, 13, 23);
    g.fillTriangle(13, 3, 23, 13, 13, 23);
    g.fillStyle(0xffffff);
    g.fillRect(11, 11, 4, 4);
    g.generateTexture('enemy_shooter', 26, 26);
    g.destroy();
  }

  _makeBullets() {
    let g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x00ffff);
    g.fillCircle(3, 3, 3);
    g.fillStyle(0xffffff);
    g.fillCircle(3, 3, 1);
    g.generateTexture('bullet_player', 6, 6);
    g.destroy();

    g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xff3300);
    g.fillCircle(3, 3, 3);
    g.fillStyle(0xff9966);
    g.fillCircle(3, 3, 1);
    g.generateTexture('bullet_enemy', 6, 6);
    g.destroy();
  }

  _makeHearts() {
    const drawHeart = (g, filled) => {
      if (filled) {
        g.fillStyle(0xee1133);
        g.fillRect(2, 4, 4, 4);
        g.fillRect(10, 4, 4, 4);
        g.fillRect(0, 6, 16, 6);
        g.fillRect(2, 12, 12, 2);
        g.fillRect(4, 14, 8, 2);
        g.fillRect(6, 16, 4, 2);
        g.fillStyle(0xff4466);
        g.fillRect(2, 4, 2, 2);
      } else {
        g.lineStyle(2, 0x555566);
        g.strokeRect(2, 4, 4, 4);
        g.strokeRect(10, 4, 4, 4);
        g.strokeRect(0, 6, 16, 8);
      }
    };

    let g = this.make.graphics({ x: 0, y: 0, add: false });
    drawHeart(g, true);
    g.generateTexture('heart_full', 16, 18);
    g.destroy();

    g = this.make.graphics({ x: 0, y: 0, add: false });
    drawHeart(g, false);
    g.generateTexture('heart_empty', 16, 18);
    g.destroy();
  }

  _makeParticle() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xffffff);
    g.fillRect(0, 0, 4, 4);
    g.generateTexture('particle', 4, 4);
    g.destroy();
  }
}
