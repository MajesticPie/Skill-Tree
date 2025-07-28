import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAHlhlkT3qr-BnAUmUkmL7q8O-sS8IGbfM",
    authDomain: "skilltree-7d36e.firebaseapp.com",
    projectId: "skilltree-7d36e",
    storageBucket: "skilltree-7d36e.firebasestorage.app",
    messagingSenderId: "933469258781",
    appId: "1:933469258781:web:920cc7d096ac96890a32f4",
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)



export { app, auth };
