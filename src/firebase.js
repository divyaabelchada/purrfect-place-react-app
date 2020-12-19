import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA75DANsbOUrKPExc_QoUe1ekuWKmJfUNE",
  authDomain: "purrfect-place-webapp.firebaseapp.com",
  databaseURL: "https://purrfect-place-webapp.firebaseio.com",
  projectId: "purrfect-place-webapp",
  storageBucket: "purrfect-place-webapp.appspot.com",
  messagingSenderId: "917285172106",
  appId: "1:917285172106:web:28aef2012728d460700e73",
  measurementId: "G-SKQS5FF8P5",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider, storage };
export default db;
