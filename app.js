// ==========================
// IMPORTS
// ==========================

// Firebase core
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// Auth
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firestore
import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================
// FIREBASE CONFIG
// ==========================
const firebaseConfig = {
  apiKey: "AIzaSyBGyOV-FnP9F4ZWjQ5mtwEbPsPLKPJIGg8",
  authDomain: "my-game-app-dfc17.firebaseapp.com",
  projectId: "my-game-app-dfc17",
  storageBucket: "my-game-app-dfc17.firebasestorage.app",
  messagingSenderId: "82774983499",
  appId: "1:82774983499:web:3b284c777d604e0f1f9ece",
  measurementId: "G-C0C8K2DN57"
};


// ==========================
// INITIALIZE
// ==========================
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


// ==========================
// SIGNUP
// ==========================
window.signup = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Signup successful ✅");
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert(error.message);
    });
};


// ==========================
// LOGIN
// ==========================
window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login successful 🎉");
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert(error.message);
    });
};


// ==========================
// SAVE SCORE (MODULE EXPORT)
// ==========================
export async function saveScore(score) {
  const user = auth.currentUser;

  if (!user) {
    alert("Login first ❌");
    return;
  }

  try {
    await addDoc(collection(db, "scores"), {
      email: user.email,
      score: score,
      time: new Date()
    });

    alert("Score saved 🎯");
  } catch (error) {
    alert(error.message);
  }
}


// ==========================
// LOAD LEADERBOARD
// ==========================
window.loadLeaderboard = async function () {
  try {
    const q = query(collection(db, "scores"), orderBy("score", "desc"));
    const querySnapshot = await getDocs(q);

    const list = document.getElementById("leaderboard");
    if (!list) return;

    list.innerHTML = "";

    let rank = 1;

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const li = document.createElement("li");
      li.textContent = `${rank}. ${data.email} - ${data.score}`;

      list.appendChild(li);
      rank++;
    });

  } catch (error) {
    alert(error.message);
  }
};