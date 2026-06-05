/**
 * game/systems/CameraSystem.ts
 *
 * Configures the main camera to follow the player smoothly
 * and clamp to the level bounds.
 */
import Phaser from "phaser";
import { Player } from "../entities/Player";
import { CAMERA_LERP_X, CAMERA_LERP_Y } from "../config/gameConfig";

export class CameraSystem {
  private camera: Phaser.Cameras.Scene2D.Camera;

  constructor(scene: Phaser.Scene, levelWidth: number, levelHeight: number) {
    this.camera = scene.cameras.main;

    // Set camera bounds to the full level
    this.camera.setBounds(0, 0, levelWidth, levelHeight);
    this.camera.setBackgroundColor("#5C94FC");
  }

  followPlayer(player: Player): void {
    this.camera.startFollow(
      player,
      true, // roundPixels — prevents sub-pixel jitter on pixel art
      CAMERA_LERP_X,
      CAMERA_LERP_Y,
    );

    // Offset camera slightly ahead of the player
    this.camera.setFollowOffset(-60, 0);
  }

  shake(intensity = 0.01, duration = 200): void {
    this.camera.shake(duration, intensity);
  }

  flash(color = 0xffffff, duration = 200): void {
    const red = (color >> 16) & 0xff;
    const green = (color >> 8) & 0xff;
    const blue = color & 0xff;
    this.camera.flash(duration, red, green, blue);
  }

  get cam(): Phaser.Cameras.Scene2D.Camera {
    return this.camera;
  }
}
