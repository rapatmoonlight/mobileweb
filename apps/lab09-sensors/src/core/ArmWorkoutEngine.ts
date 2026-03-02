import type { AccelSample, WorkoutState } from "./types";

type Phase = "WAIT_UP" | "WAIT_DOWN";

export class ArmWorkoutEngine {
  private listeners = new Set<(s: WorkoutState) => void>();

  private lastRepTime = 0;
  private peak = -Infinity;
  private valley = Infinity;
  private maxSide = 0;
  private phase: Phase = "WAIT_UP";
  private smoothY = 0;
  private alpha = 0.2;

  state: WorkoutState = {
    status: "IDLE",
    repDisplay: 0,
    stats: {
      repsTotal: 0,
      repsOk: 0,
      repsBad: 0,
      score: 0,
      avgRepMs: 0,
      percent: 0,
      lastMessage: "",
    },
  };

  onChange(cb: (s: WorkoutState) => void) {
    this.listeners.add(cb);
    cb(this.clone());
    return () => this.listeners.delete(cb);
  }

  start() {
    const now = Date.now();

    this.state = {
      status: "RUNNING",
      repDisplay: 0,
      stats: {
        repsTotal: 0,
        repsOk: 0,
        repsBad: 0,
        score: 0,
        avgRepMs: 0,
        percent: 0,
        lastMessage: "เริ่มได้",
      },
    };

    this.phase = "WAIT_UP";
    this.lastRepTime = now;
    this.resetMotion();
    this.emit();
  }

  stop() {
    this.state.status = "STOPPED";
    this.emit();
  }

  process(sample: AccelSample) {
    if (this.state.status !== "RUNNING") return;

console.log(
  "AX:", sample.ax.toFixed(2),
  "AY:", sample.ay.toFixed(2),
  "AZ:", sample.az.toFixed(2)
);

    const rawY = sample.az;

// smoothing (low-pass filter)
this.smoothY = this.alpha * rawY + (1 - this.alpha) * this.smoothY;
const y = this.smoothY;

    const side = Math.abs(sample.ax);

    // เก็บค่าสูงสุดต่ำสุดในรอบนั้น
    this.peak = Math.max(this.peak, y);
    this.valley = Math.min(this.valley, y);
    this.maxSide = Math.max(this.maxSide, side);

    const UP_TH = 1.2;
const DOWN_TH = -1.2;
const MIN_ROM = 1.8;
const MIN_MS = 600; 
const MAX_MS = 8000;  

const MAX_SIDE = 3;

    if (this.phase === "WAIT_UP") {
      if (y > UP_TH) {
        this.phase = "WAIT_DOWN";
        this.lastRepTime = sample.t;
      }
    } else {
      // กันนับซ้ำเร็วเกิน
      if (sample.t - this.lastRepTime < MIN_MS) return;

      if (y < DOWN_TH) {
        const repMs = sample.t - this.lastRepTime;
        this.lastRepTime = sample.t;

        const rom = this.peak - this.valley;
        this.state.stats.repsTotal++;

        let ok = true;
        let msg = "OK";

        if (rom < MIN_ROM) {
          ok = false;
          msg = "ยกแขนต่ำเกินไป";
        } else if (repMs < MIN_MS) {
          ok = false;
          msg = "เร็วเกินไป";
        } else if (repMs > MAX_MS) {
          ok = false;
          msg = "ช้าเกินไป";
        } else if (this.maxSide > MAX_SIDE) {
          ok = false;
          msg = "กรุณายกแนวตั้ง";
        }

        if (ok) {
          this.state.repDisplay++;
          this.state.stats.repsOk++;
          this.state.stats.score += 10;

          const s = this.state.stats;
          s.avgRepMs = Math.round(
            (s.avgRepMs * (s.repsOk - 1) + repMs) / s.repsOk
          );
        } else {
          this.state.stats.repsBad++;
        }

        const s = this.state.stats;
        s.percent =
          s.repsTotal > 0
            ? Math.round((s.repsOk / s.repsTotal) * 100)
            : 0;

        s.lastMessage = msg;

        this.phase = "WAIT_UP";
        this.resetMotion();
        this.emit();
      }
    }
  }

  private resetMotion() {
    this.peak = -Infinity;
    this.valley = Infinity;
    this.maxSide = 0;
    this.smoothY = 0;
  }

  private emit() {
    const snap = this.clone();
    this.listeners.forEach((cb) => cb(snap));
  }

  private clone(): WorkoutState {
    return JSON.parse(JSON.stringify(this.state));
  }
}