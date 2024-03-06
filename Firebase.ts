import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDiCbuzPGFHLlFevwA-4cbNupiKCjfKu1U",
  authDomain: "dropbox-clone-fdbc8.firebaseapp.com",
  projectId: "dropbox-clone-fdbc8",
  storageBucket: "dropbox-clone-fdbc8.appspot.com",
  messagingSenderId: "313567296292",
  appId: "1:313567296292:web:b98ac07a64349589f911b1",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export { db, storage };
