// Importing Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOVNUYxpoW9lMPnn4YoosDGdaIgBTbCVA",
  authDomain: "hotdogbot-e885d.firebaseapp.com",
  databaseURL: "https://hotdogbot-e885d-default-rtdb.firebaseio.com",
  projectId: "hotdogbot-e885d",
  storageBucket: "hotdogbot-e885d.appspot.com",
  messagingSenderId: "828981970144",
  appId: "1:828981970144:web:5c20268b5c0a24bf10fc85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export module
export default app;