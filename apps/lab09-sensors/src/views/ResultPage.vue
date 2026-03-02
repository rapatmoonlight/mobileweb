<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Workout Summary</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="container">
        <h1 class="title">สรุปผลการกายบริหาร</h1>

        <div class="card">
          <p>รอบทั้งหมด: {{ stats.repsTotal }}</p>
          <p>รอบที่ถูก: {{ stats.repsOk }}</p>
          <p>รอบที่ผิด: {{ stats.repsBad }}</p>
          <p>คะแนนรวม: {{ stats.score }}</p>
          <p>ความเร็วเฉลี่ย: {{ stats.avgRepMs }} ms</p>
          <p>เปอร์เซ็นต์ถูก: {{ stats.percent }}%</p>
        </div>

        <div class="result-message">
          <h2>{{ performanceMessage }}</h2>
        </div>

        <ion-button expand="block" @click="goHome">
          กลับหน้าเริ่มต้น
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from "@ionic/vue";

const route = useRoute();
const router = useRouter();

/* ✅ รับข้อมูลจาก query */
const stats = route.query.data
  ? JSON.parse(route.query.data as string)
  : {
      repsTotal: 0,
      repsOk: 0,
      repsBad: 0,
      score: 0,
      avgRepMs: 0,
      percent: 0,
    };

/* ✅ ข้อความสรุปผลงาน */
const performanceMessage = computed(() => {
  if (stats.percent >= 80) return "ยอดเยี่ยมมาก!";
  if (stats.percent >= 50) return "ทำได้ดี!";
  if (stats.repsTotal === 0) return "ยังไม่ได้เริ่มออกกำลังกาย";
  return "พยายามอีกครั้งนะ!";
});

/* ✅ กลับหน้าแรก */
function goHome() {
  router.push("/");
}
</script>

<style scoped>
.container {
  text-align: center;
}

.title {
  margin-bottom: 20px;
}

.card {
  margin: 20px 0;
  padding: 20px;
  border-radius: 16px;
  background: #f2f2f2;
  font-size: 18px;
}

.result-message {
  margin: 20px 0;
  font-weight: bold;
  font-size: 20px;
}
</style>