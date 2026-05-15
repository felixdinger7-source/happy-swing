# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the game

The game requires a local HTTP server (ES modules block file:// protocol):

```bash
python3 -m http.server 8765
# then open http://localhost:8765
```

There is no build step, no package manager, and no test suite. Phaser 3 is loaded via CDN in `index.html`.

## Architecture

**Entry point:** `index.html` loads Phaser 3.60 from CDN, then `js/main.js` which registers all scenes and boots the game at 800×600.

**Scene lifecycle (in order):**
```
Boot → Menu → Game (+ HUD launched as parallel scene)
                ↓
         LevelComplete → Game (next level, score carried via scene data)
                ↓
            GameOver → Menu
```
Scene transitions always pass `{ level, score }` as init data. `GameScene.resumeNextLevel()` is called by `LevelCompleteScene` to stop/restart `Game` and `HUD` with the new level number.

**All textures are procedural.** `BootScene` generates every texture at startup using `scene.make.graphics() → .generateTexture(key) → .destroy()`. There are no image files. To change a sprite's appearance, edit the corresponding `_make*` method in `js/scenes/BootScene.js`.

**Player is not a Phaser sprite.** `Player` is a plain class that owns two Phaser objects: `this.sprite` (physics sprite, used for collision) and `this.gun` (plain image, no physics, rotates toward mouse each frame). Collisions in `GameScene` are registered against `player.sprite` and `player.bullets`, not the `Player` instance itself.

**Enemy types are data-driven.** `js/config/levels.js` exports `ENEMY_DEFS` (stats per type) and `LEVELS` (per-level spawn config). Adding a new enemy type requires: a new entry in both exports, a `_make*` method in `BootScene`, and a new `case` in `Enemy.updateAI()`. Shooter enemies own their own bullet group (`this.enemyBullets`) and the overlap with the player is lazily registered in `GameScene.update()` on first update.

**Cross-scene communication** uses two patterns — sometimes mixed within the same scene pair:
- Init data (`scene.start('X', { ... })`) for one-time values at scene start.
- Phaser events (`this.events.emit / .on`) for async runtime updates — `GameScene` emits `player-hp`, `HUDScene` listens to refresh hearts.
- Direct scene reference (`this.scene.get('HUD').updateKills(...)`) for synchronous calls from `GameScene` to `HUD` on kill. Both patterns coexist in `HUDScene`.

**Particle system** is a plain `physics.add.group` with a custom `preUpdate` monkey-patched onto each particle via `createCallback`. Particles self-destruct via `_life` countdown; the group is shared across all enemy deaths (`this.particles` in `GameScene`).

**World vs viewport:** The play area is 1600×1200; the canvas is 800×600. The camera follows the player with 0.1 lerp. All enemy spawn logic uses world coordinates (`_edgePosition` in `GameScene`). Mouse aim must convert screen coords to world coords: `scrollX + ptr.x`.

**Depth layers** (set via `setDepth()`): background = 0, enemies = 8, player body = 10, player gun = 11, HUD elements = 200, scene overlays (scanlines, GameOver bg) = 300+. New game objects must be placed within this hierarchy or they'll render above/below unintended layers.

**Physics debug:** To visualize collision bodies, set `arcade: { debug: true }` in `js/main.js`. Revert before committing.

## Key constants to tune

| File | Constant | Effect |
|------|----------|--------|
| `Player.js` | `SPEED`, `SHOOT_COOLDOWN`, `MAX_HP` | Player feel |
| `Player.js` | `INVINCIBLE_MS` | Post-hit grace period |
| `levels.js` | `spawnInterval`, `killTarget` | Per-level difficulty |
| `levels.js` | `ENEMY_DEFS[type].speed/hp` | Per-enemy stats |
| `GameScene.js` | `WORLD_W`, `WORLD_H` | Arena size |

## Git workflow

All changes should be committed with clean descriptive messages and pushed to GitHub (`git push`). The remote is `https://github.com/felixdinger7-source/happy-swing`.
