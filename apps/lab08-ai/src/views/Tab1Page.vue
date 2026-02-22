<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Lab08: Gemini Vision โดย รภัสฐิดา รอดวงศ์</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- hidden file input -->
      <input
        ref="fileEl"
        type="file"
        accept="image/*"
        hidden
        @change="onFileChange"
      />

      <!-- buttons -->
      <ion-button expand="block" @click="fileEl?.click()">
        📁 เลือกไฟล์ภาพ
      </ion-button>

      <ion-button expand="block" color="secondary" @click="onTakePhoto">
        📷 ถ่ายภาพ
      </ion-button>

      <!-- preview -->
      <ion-card v-if="previewUrl">
        <ion-img :src="previewUrl" />
      </ion-card>

      <!-- analyze button -->
      <ion-button
        expand="block"
        color="success"
        :disabled="!img || loading"
        @click="onAnalyze"
      >
        🔍 วิเคราะห์ภาพ
      </ion-button>

      <!-- loading -->
      <div class="center" v-if="loading">
        <ion-spinner name="crescent" />
        <p>กำลังวิเคราะห์...</p>
      </div>

      <!-- result -->
      <div v-if="result" class="result-box">

        <!-- caption -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>📄 คำอธิบายภาพ</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            {{ result.caption }}
          </ion-card-content>
        </ion-card>

        <!-- tags -->
        <ion-card v-if="result.tags?.length">
          <ion-card-header>
            <ion-card-title>🏷 แท็ก</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-chip
              v-for="tag in result.tags"
              :key="tag"
              color="primary"
            >
              <ion-label>{{ tag }}</ion-label>
            </ion-chip>
          </ion-card-content>
        </ion-card>

        <!-- objects -->
        <ion-card v-if="result.objects?.length">
          <ion-card-header>
            <ion-card-title>📦 วัตถุที่พบ</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item
                v-for="obj in result.objects"
                :key="obj"
              >
                {{ obj }}
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <!-- safety -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>🛡 ความปลอดภัย</ion-card-title>
          </ion-card-header>
          <ion-card-content class="center">
            <ion-badge :color="result.safety ? 'danger' : 'success'">
              {{ result.safety ? "อาจเป็นภาพอ่อนไหว" : "ปลอดภัย" }}
            </ion-badge>
          </ion-card-content>
        </ion-card>

      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonLabel,
  IonList,
  IonItem,
  IonBadge
} from "@ionic/vue";

import { PhotoService } from "../core/photo.service";
import { GeminiVisionService } from "../core/gemini.service";
import type { Base64Image, ImageAnalysisResult } from "../core/ai.interface";

/* state */
const fileEl = ref<HTMLInputElement | null>(null);
const img = ref<Base64Image | null>(null);
const previewUrl = ref("");
const result = ref<ImageAnalysisResult | null>(null);
const loading = ref(false);

/* select file */
async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  img.value = await PhotoService.fromFile(file);
  previewUrl.value = URL.createObjectURL(file);
  result.value = null;
}

/* take photo */
async function onTakePhoto() {
  loading.value = true;
  try {
    const b64 = await PhotoService.fromCamera();
    img.value = b64;
    previewUrl.value = `data:${b64.mimeType};base64,${b64.base64}`;
    result.value = null;
  } finally {
    loading.value = false;
  }
}

/* analyze */
async function onAnalyze() {
  if (!img.value) return;

  loading.value = true;
  try {
    result.value = await GeminiVisionService.analyze(img.value);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.center {
  text-align: center;
  margin-top: 20px;
}

.result-box {
  margin-top: 18px;
}

ion-chip {
  margin: 4px;
}

ion-img {
  border-radius: 14px;
}
</style>