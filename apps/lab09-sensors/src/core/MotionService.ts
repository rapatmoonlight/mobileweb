import { Motion } from "@capacitor/motion";

export type MotionSample = {
  ax: number;
  ay: number;
  az: number;
  t: number;
};

export class MotionService {
  private listener: any;

  async start(callback: (s: MotionSample) => void) {
    this.listener = await Motion.addListener("accel", (event) => {
      callback({
        ax: event.acceleration?.x ?? 0,
        ay: event.acceleration?.y ?? 0,
        az: event.acceleration?.z ?? 0,
        t: Date.now(),
      });
    });
  }

  async stop() {
    if (this.listener) {
      await this.listener.remove();
      this.listener = null;
    }
  }
}