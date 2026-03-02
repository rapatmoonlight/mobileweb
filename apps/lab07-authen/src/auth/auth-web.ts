// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCZD5Y6MRbziNE9ydMvt31Rncdv1We7004",
  authDomain: "lab06-expense-84c96.firebaseapp.com",
  projectId: "lab06-expense-84c96",
  storageBucket: "lab06-expense-84c96.firebasestorage.app",
  messagingSenderId: "657389576868",
  appId: "1:657389576868:web:3bdc2f47f5b5e3b22c3c31",
  measurementId: "G-C4N1WCHC65"
};

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  ConfirmationResult,
  RecaptchaVerifier,
  updateProfile
} from "firebase/auth";

import type {
  AuthUser,
  IAuthService,
  EmailPasswordCredentials,
  PhoneCredentials
} from "./auth-interface";


// ---------------- INIT ----------------
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);


// ---------------- USER MAP ----------------
function mapUser(u: any): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    phoneNumber: u.phoneNumber, // ← เพิ่มบรรทัดนี้
    displayName: u.displayName,
    photoUrl: u.photoURL,
  };
}

// ---------------- RECAPTCHA ----------------
let verifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

const recaptchaContainerId = "recaptcha-container";

export function getRecaptchaVerifier(containerId: string) {
  if (!verifier) {
    verifier = new RecaptchaVerifier(
      firebaseAuth,
      containerId,
      { size: "invisible" }
    );
  }
  return verifier;
}


// ================= SERVICE =================
export class FirebaseWebAuthService implements IAuthService {

  async getCurrentUser() {
    return firebaseAuth.currentUser
      ? mapUser(firebaseAuth.currentUser)
      : null;
  }

  // ---------- EMAIL LOGIN ----------
  async loginWithEmailPassword(creds: EmailPasswordCredentials) {
    const r = await signInWithEmailAndPassword(
      firebaseAuth,
      creds.email,
      creds.password
    );

    // ถ้ายังไม่มีชื่อ → ตั้งชื่อ default
    if (!r.user.displayName) {
      await updateProfile(r.user, {
        displayName: "User-" + r.user.uid.slice(0,5)
      });
    }

    return mapUser(r.user);
  }

  // ---------- GOOGLE LOGIN ----------
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const r = await signInWithPopup(firebaseAuth, provider);
    return mapUser(r.user);
  }

  // ---------- LOGOUT ----------
  async logout() {
    await firebaseAuth.signOut();
  }

  // ---------- PHONE LOGIN ----------
  async startPhoneLogin(
    creds: PhoneCredentials
  ): Promise<{ verificationId: string }> {

    const verifier = getRecaptchaVerifier(recaptchaContainerId);

    confirmationResult = await signInWithPhoneNumber(
      firebaseAuth,
      creds.phoneNumberE164,
      verifier
    );

    return { verificationId: confirmationResult.verificationId };
  }

  async confirmPhoneCode(payload: {
    verificationId: string;
    verificationCode: string;
  }): Promise<AuthUser> {

    if (!confirmationResult)
      throw new Error("No confirmation result");

    const r = await confirmationResult.confirm(payload.verificationCode);

    return mapUser(r.user);
  }
}
