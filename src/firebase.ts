// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA13DeUGCYaqJwnFy-7h8eOeZ5FJcTyVNA",
  authDomain: "coinflip-arb-88718.firebaseapp.com",
  projectId: "coinflip-arb-88718",
  storageBucket: "coinflip-arb-88718.appspot.com",
  messagingSenderId: "422714054156",
  appId: "1:422714054156:web:5b9583fcc2d0b49ecd0029",
  measurementId: "G-L26EJK3RFN",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
