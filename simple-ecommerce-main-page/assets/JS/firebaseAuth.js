// -------------------- Firebase Config --------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCDN_w_0LcMPWKgqlL9bh8RvkyXlmFb3XI",
  authDomain: "simple-ecommerce-auth.firebaseapp.com",
  projectId: "simple-ecommerce-auth",
  storageBucket: "simple-ecommerce-auth.firebasestorage.app",
  messagingSenderId: "260024870991",
  appId: "1:260024870991:web:e870677bb28b787af4a23a",
  measurementId: "G-W0F92WSZQM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// -------------------- Utility --------------------
export function clearErrors(form) {
  form
    .querySelectorAll(".error-msg")
    .forEach((span) => (span.textContent = ""));
}

export function showError(input, message) {
  let span = input.parentElement.querySelector(".error-msg");
  if (!span) {
    span = document.createElement("span");
    span.classList.add("error-msg");
    input.parentElement.appendChild(span);
  }
  span.textContent = message;
}

// -------------------- Validation --------------------
export function validateSignUp(name, email, password, confirmPassword, form) {
  clearErrors(form);
  let valid = true;

  if (!name || name.length < 3) {
    showError(
      form.querySelector('input[placeholder="Username"]'),
      "Name must be at least 3 characters"
    );
    valid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email)) {
    showError(
      form.querySelector('input[placeholder="Email"]'),
      "Invalid email address"
    );
    valid = false;
  }

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  if (!password || !passwordPattern.test(password)) {
    showError(
      form.querySelector('input[placeholder="Password"]'),
      "Password must be at least 6 characters with uppercase, lowercase & number"
    );
    valid = false;
  }

  if (!confirmPassword || password !== confirmPassword) {
    showError(
      form.querySelector('input[placeholder="Confirm Password"]'),
      "Passwords do not match"
    );
    valid = false;
  }

  return valid;
}

export function validateSignIn(email, password, form) {
  clearErrors(form);
  let valid = true;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email)) {
    showError(
      form.querySelector('input[placeholder="Username"]'),
      "Invalid email"
    );
    valid = false;
  }

  if (!password || password.length < 6) {
    showError(
      form.querySelector('input[placeholder="Password"]'),
      "Password must be at least 6 characters"
    );
    valid = false;
  }

  return valid;
}

// -------------------- Auth Methods --------------------
export async function signUp(name, email, password) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await updateProfile(userCredential.user, { displayName: name });
  return userCredential.user;
}

export async function signIn(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}
