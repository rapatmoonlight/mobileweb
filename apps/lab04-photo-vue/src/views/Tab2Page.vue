<template>
  <ion-page>
    <!-- Normal header -->
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery<br><small>โดย รภัสฐิดา รอดวงศ์ 673380505-4</small></ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <!-- Condense header for iOS large title -->
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            Photo Gallery<br><small>โดย รภัสฐิดา รอดวงศ์ 673380505-4</small>
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row>
          <!-- CHANGE: Create a new column and image component for each photo -->
          <ion-col size="6" :key="photo.filepath" v-for="photo in photos">
            <ion-img :src="photo.webviewPath"></ion-img>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Floating Action Button -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed" class="fab-bottom-right">
  <ion-fab-button @click="addNewToGallery()">
    <ion-icon :icon="camera"></ion-icon>
  </ion-fab-button>
</ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { camera, trash, close  } from 'ionicons/icons';
import { IonPage, IonHeader, IonFab, IonFabButton, IonIcon, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { Camera, CameraResultType } from '@capacitor/camera';

import { usePhotoGallery } from '@/composables/usePhotoGallery';

const { photos, addNewToGallery } = usePhotoGallery();

// CHANGE: Destructure `addNewToGallery` from `usePhotoGallery()

const takePhoto = async () => {
  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri
    });
    console.log('Photo taken:', photo.webPath);
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped>
small {
  font-size: 0.8rem;
  color: var(--ion-color-medium);
}
.fab-bottom-right {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
}
</style>