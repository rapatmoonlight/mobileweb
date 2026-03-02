<template>
  <div class="login-container">
    <h1>Login</h1>

    <!-- Email -->
    <div class="card">
      <h3>Email / Password</h3>
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="loginEmail">Login</button>
    </div>

    <!-- Google -->
    <div class="card">
      <h3>Google</h3>
      <button @click="loginGoogle">Login with Google</button>
    </div>

    <!-- Phone -->
    <div class="card">
      <h3>Phone</h3>
      <input v-model="phone" placeholder="+66xxxxxxxxx" />
      <button @click="loginPhone">Login by Phone</button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>

  <!-- recaptcha -->
  <div id="recaptcha-container"></div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/auth/auth-service";

const router = useRouter();

const email = ref("");
const password = ref("");
const phone = ref("");
const error = ref("");

function goTab() {
  router.replace("/tabs/tab1");
}


// EMAIL
async function loginEmail() {
  error.value = "";
  try {
    await authService.loginWithEmailPassword({
      email: email.value,
      password: password.value
    });
    goTab();
  } catch (e:any) {
    error.value = e.message || "Login failed";
  }
}


// GOOGLE
async function loginGoogle() {
  error.value = "";
  try {
    await authService.loginWithGoogle();
    goTab();
  } catch (e:any) {
    error.value = e.message || "Google login failed";
  }
}


// PHONE
async function loginPhone() {
  error.value = "";
  try {
    const result = await authService.startPhoneLogin({
      phoneNumberE164: phone.value
    });

    const code = prompt("Enter OTP");
    if (!code) return;

    await authService.confirmPhoneCode({
      verificationId: result.verificationId,
      verificationCode: code
    });

    goTab();

  } catch (e:any) {
    error.value = e.message || "Phone login failed";
  }
}
</script>

<style scoped>
.login-container{
  max-width:400px;
  margin:auto;
  padding:40px;
  text-align:center;
}
.card{
  border:1px solid #ddd;
  padding:20px;
  margin:15px 0;
  border-radius:10px;
}
input{
  display:block;
  width:100%;
  margin:8px 0;
  padding:8px;
}
button{
  width:100%;
  padding:10px;
  cursor:pointer;
}
.error{
  color:red;
  margin-top:10px;
}
</style>
