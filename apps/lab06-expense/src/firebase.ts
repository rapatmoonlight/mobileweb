import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZD5Y6MRbziNE9ydMvt31Rncdv1We7004",
  authDomain: "lab06-expense-84c96.firebaseapp.com",
  projectId: "lab06-expense-84c96",
  storageBucket: "lab06-expense-84c96.appspot.com",
  messagingSenderId: "657389576868",
  appId: "1:657389576868:web:3bdc2f47f5b5e3b22c3c31",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
