import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDZtBxlS8mMNHKqvwOEmXTUggPPXQqfM-o",
  authDomain: "blog-app-d99e6.firebaseapp.com",
  projectId: "blog-app-d99e6",
  storageBucket: "blog-app-d99e6.appspot.com",
  messagingSenderId: "900968402662",
  appId: "1:900968402662:web:dbd0b50f50535df81b3527",
  measurementId: "G-T4SN82TMHM"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;

