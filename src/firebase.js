// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdsZoacxTbgh0lvYjXb-SV7o1wqNfTVok",
  authDomain: "the-trenches-46754.firebaseapp.com",
  databaseURL: "https://the-trenches-46754-default-rtdb.firebaseio.com",
  projectId: "the-trenches-46754",
  storageBucket: "the-trenches-46754.appspot.com",
  messagingSenderId: "647406381264",
  appId: "1:647406381264:web:9546b0e4c793a0c74d16d5",
  measurementId: "G-8S7ZNR9YE7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { app, analytics, database, storage };
