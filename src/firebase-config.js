import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyB7Ys-45xyVdKHNfVY_1cUqEQZehM-Y9YI",
    authDomain: "fir-todo-e7f41.firebaseapp.com",
    projectId: "fir-todo-e7f41",
    storageBucket: "fir-todo-e7f41.appspot.com",
    messagingSenderId: "799523730085",
    appId: "1:799523730085:web:9d55842a1283a97813934c",
    measurementId: "G-7GRGN5SBGW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore();
const analytics = getAnalytics(app);