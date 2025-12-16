// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBc2rlRBrd2EpbzJpO2lHslvpqhRQ1AAw",
  authDomain: "christmas-card-cj.firebaseapp.com",
  projectId: "christmas-card-cj",
  storageBucket: "christmas-card-cj.appspot.com",
  messagingSenderId: "1077460756340",
  appId: "1:1077460756340:web:0fd6bf170e5e2d8f48ee21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const overlay = document.querySelector(".santa-overlay");
const container = document.querySelector(".container");
const saveBtn = document.querySelector(".save");
const cancelBtn = document.querySelector(".cancel");
const noteTitle = document.querySelector(".note-title");
const noteText = document.querySelector("textarea");
const notesList = document.querySelector(".sticky-notes");

overlay.addEventListener("click", () => {
  overlay.classList.add("hidden"); // add the CSS class
  container.style.display = "flex"; // show notes container

  // Optional: remove from DOM after animation
  setTimeout(() => {
    overlay.style.display = "none";
  }, 500); // match transition duration
});

// Save note to Firestore
saveBtn.addEventListener("click", async () => {
  const title = noteTitle.value.trim();
  const content = noteText.value.trim();
  if (!title || !content) return alert("Please fill in both fields!");

  try {
    await addDoc(collection(db, "notes"), {
      title,
      content,
      timestamp: serverTimestamp()
    });
    noteTitle.value = "";
    noteText.value = "";
  } catch (err) {
    console.error("Error adding document:", err);
  }
});

// Cancel button clears input
cancelBtn.addEventListener("click", () => {
  noteTitle.value = "";
  noteText.value = "";
});

// Display notes in real-time with your sticky-note CSS
const q = query(collection(db, "notes"), orderBy("timestamp", "desc"));
onSnapshot(q, snapshot => {
  notesList.innerHTML = "";
  snapshot.forEach(doc => {
    const note = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="#">
        <h2>${note.title}</h2>
        <p>${note.content}</p>
      </a>
    `;
    notesList.appendChild(li);
  });
});
