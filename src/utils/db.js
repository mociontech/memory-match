// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  Timestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAg8fcs_rBQlB7xCxGm1Xq-1X9ISe-stY",
  authDomain: "multirepos.firebaseapp.com",
  projectId: "multirepos",
  storageBucket: "multirepos.appspot.com",
  messagingSenderId: "543787682717",
  appId: "1:543787682717:web:68309224639c36ee787d74",
  measurementId: "G-7D3MCCEZMR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function register(name, correo) {
  try {
    const isExisting = await getDoc(doc(db, "DBStandMocion", correo));
    if (isExisting.data()) {
      return;
    } else {
      await setDoc(doc(db, "DBStandMocion", correo), {
        nombre: name,
        correo: correo,
        fecha: Timestamp.now(),
      });
    }
  } catch (error) {
    console.log(error);
  }
}
