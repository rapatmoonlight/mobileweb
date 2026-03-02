<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Arm Workout App</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="container">
        <h1 class="big-number">{{ state?.repDisplay ?? 0 }}</h1>

        <p class="feedback">
          {{ state?.stats.lastMessage }}
        </p>

        <div class="stats">
          <p>คะแนน: {{ state?.stats.score }}</p>
          <p>ทำทั้งหมด: {{ state?.stats.repsTotal }}</p>
          <p>ถูก: {{ state?.stats.repsOk }}</p>
          <p>ผิด: {{ state?.stats.repsBad }}</p>
          <p>เวลาเฉลี่ย: {{ state?.stats.avgRepMs }} ms</p>
          <p>เปอร์เซ็นต์ถูก: {{ state?.stats.percent }}%</p>
        </div>

        <ion-button expand="block" @click="start">
          START
        </ion-button>

        <ion-button expand="block" color="medium" @click="stop">
          STOP
        </ion-button>

  
      </div>
    </ion-content>

    <ion-footer class="ion-padding">
      673380505-4 นางสาวรภัสฐิดา รอดวงศ์
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonFooter,
} from "@ionic/vue";

import { MotionService } from "../core/MotionService";
import { TtsService } from "../core/TtsService";
import { HapticsService } from "../core/HapticsService";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import type { WorkoutState } from "../core/types";

import { useRouter } from "vue-router";

const router = useRouter();

const state = ref<WorkoutState | null>(null);

const engine = new ArmWorkoutEngine();
const motion = new MotionService();
const tts = new TtsService();
const haptic = new HapticsService();

onMounted(() => {
  engine.onChange((s) => (state.value = s));
});

watch(
  () => state.value?.stats.lastMessage,
  async (msg) => {
    if (!msg) return;

    if (msg === "OK") {
      await haptic.success();
      await tts.speak(String(state.value?.repDisplay));
    } else {
      await haptic.warning();
      await tts.speak(msg);
    }
  }
);

async function start() {
  engine.start();

  await tts.speak(
    "กรุณาเริ่มจากแขนแนบลำตัว แล้ว ยกโทรศัพท์ขึ้นแนวตั้งจนสุดแขน"
  );

  await motion.start((s) => {
    engine.process(s);
  });
}

async function stop() {
  await motion.stop();
  engine.stop();

  router.push({
    path: "/result",
    query: {
      data: JSON.stringify(state.value?.stats),
    },
  });
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
}

.big-number {
  font-size: 80px;
  font-weight: bold;
  margin-bottom: 20px;
}

.feedback {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.stats {
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
}
</style>