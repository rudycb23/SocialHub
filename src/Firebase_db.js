import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvNSv2FwAzlLnWnxytJdvnoSNLaaNrvvk",
  authDomain: "socialhub-12b6a.firebaseapp.com",
  databaseURL: "https://socialhub-12b6a-default-rtdb.firebaseio.com",
  projectId: "socialhub-12b6a",
  storageBucket: "socialhub-12b6a.appspot.com",
  messagingSenderId: "234618408381",
  appId: "1:234618408381:web:064f1ab695967aa12356d4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const getFirestoreInstance = () => firestore;

export { auth, firestore, getFirestoreInstance };
