<template>
  <ion-page>
    <ion-content class="ion-padding">

      <div v-if="user">
        <h2>User Profile</h2>
        <p><b>UID:</b> {{ user.uid }}</p>
        <p><b>Email:</b> {{ user.email }}</p>
        <p><b>Phone:</b> {{ user.phoneNumber || "-" }}</p>
        <p><b>Name:</b> {{ user.displayName }}</p>

        <ion-button @click="logout">Logout</ion-button>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { authService } from "@/auth/auth-service";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref<any>(null);

onMounted(async () => {
  user.value = await authService.getCurrentUser();
});

async function logout() {
  try {
    await authService.logout();
    await router.replace("/login");
    
    user.value = null; 
  } catch (e) {
    console.error("Logout error:", e);
  }
}
</script>


<style scoped>
.container{
  text-align:center;
  padding:30px;
}
.avatar{
  width:100px;
  height:100px;
  border-radius:50%;
  margin-bottom:15px;
}
button{
  margin-top:15px;
  padding:10px 20px;
}
</style>