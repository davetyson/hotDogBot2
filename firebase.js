// Importing Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";

// Our web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVrZZkJ2FVyreTdBQvp7TkuWgLe8QmQ_Y",
  authDomain: "hotdogbot-b4c38.firebaseapp.com",
  databaseURL: "https://hotdogbot-b4c38-default-rtdb.firebaseio.com",
  projectId: "hotdogbot-b4c38",
  storageBucket: "hotdogbot-b4c38.appspot.com",
  messagingSenderId: "64958207430",
  appId: "1:64958207430:web:d761a06825bcac0de44ec7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export module
export default app;