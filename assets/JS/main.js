import { FakeAPI } from "./FakeAPI.js";
import { ProductsCards } from "./ProductsCards.js";
import { Events } from "./events.js";
import { Product } from "./product.js";
import { Slider } from "./slider.js";
import {
  validateSignUp,
  validateSignIn,
  signUp,
  signIn,
} from "./firebaseAuth.js";

// Update login button if user is logged in
window.addEventListener("DOMContentLoaded", () => {
  const storedEmail = localStorage.getItem("userEmail");
  const loginBtn = document.querySelector('a[href="sign.html"]');

  if (storedEmail && loginBtn) {
    const loginIcon = loginBtn.querySelector("img");
    if (loginIcon) loginIcon.src = "assets/imgs/out.png";

    loginBtn.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) node.remove();
    });
    loginBtn.appendChild(document.createTextNode(" Log out"));

    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("userEmail");
      location.reload();
    });
  }
});

// Update cart badge
function updateCartBadge() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  const badge = document.getElementsByClassName("badge")[0];
  if (badge) badge.textContent = totalQty;
}

window.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});

// Add product to cart
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-add-to-cart");
  if (btn) {
    const productId = parseInt(btn.dataset.id);
    addToCart(productId);
    updateCartBadge();
  }
});

function addToCart(id) {
  let storedProducts = JSON.parse(localStorage.getItem("products")) || [];
  let product = storedProducts.find((p) => p.id === id);
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let existing = cart.find((p) => p.id === id);

  if (existing) existing.qty = (existing.qty || 1) + 1;
  else cart.push({ ...product, qty: 1 });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();

  const modalBody = document.getElementById("modalBody");
  if (modalBody) {
    modalBody.innerHTML = `
      <div class="alert alert-success mb-0 fw-bold text-center" role="alert">
        ✅ ${product.title} has been added to your cart!
      </div>
    `;
  }

  const cartModalEl = document.getElementById("cartModal");
  if (cartModalEl) {
    const cartModal = new bootstrap.Modal(cartModalEl, {
      backdrop: false,
      keyboard: true,
    });
    cartModal.show();
  }
}

var onlineProducts;

// Initialize page
window.onload = async function () {
  new Events();
  new Slider(".slider-container", true, 3000);
  var api = new FakeAPI();

  onlineProducts =
    (await api.getProducts("https://fakestoreapi.com/products")) || [];
  if (!onlineProducts.length) return;

  let newCard = new ProductsCards();
  onlineProducts.forEach((element) => {
    let product = new Product(element);
    newCard.create(product);
    newCard.addCard();
  });

  setupModal();
  updateCartBadge();
};

export function returnProductsToBeFiltered() {
  return onlineProducts;
}

// Setup product modal
function setupModal() {
  const modal = document.getElementById("productModal");
  if (!modal) return;

  const closeBtn = document.getElementById("closeModal");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalCategory = document.getElementById("modalCategory");
  const modalPrice = document.getElementById("modalPrice");
  const modalRate = document.getElementById("modalRate");
  const modalCount = document.getElementById("modalCount");
  const modalDesc = document.getElementById("modalDesc");

  closeBtn.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn-view");
    if (!btn) return;

    const productId = btn.dataset.id;
    const api = new FakeAPI();
    const product = await api.getProducts(
      `https://fakestoreapi.com/products/${productId}`
    );

    if (product) {
      modalImg.src = product.image;
      modalTitle.textContent = product.title;
      modalCategory.textContent = product.category;
      modalPrice.textContent = product.price;
      modalRate.textContent = product.rating?.rate ?? "N/A";
      modalCount.textContent = product.rating?.count ?? "0";
      modalDesc.textContent = product.description;

      modal.style.display = "flex";
    }
  });
}

// Sign Up
const signUpForm = document.querySelector(".sign-up-form");
if (signUpForm) {
  const signUpBtn =
    signUpForm.querySelector('input[type="submit"], input[type="button"]') ||
    signUpForm.querySelector(".btn");

  signUpBtn.addEventListener("click", async () => {
    const name = signUpForm
      .querySelector('input[placeholder="Username"]')
      .value.trim();
    const email = signUpForm
      .querySelector('input[placeholder="Email"]')
      .value.trim();
    const password = signUpForm.querySelector(
      'input[placeholder="Password"]'
    ).value;
    const confirmPassword = signUpForm.querySelector(
      'input[placeholder="Confirm Password"]'
    ).value;

    if (!validateSignUp(name, email, password, confirmPassword, signUpForm))
      return;

    try {
      const user = await signUp(name, email, password);
      alert(`✅ Account created successfully: ${user.email}`);
      signUpForm.reset();
    } catch (error) {
      showError(
        signUpForm.querySelector('input[placeholder="Email"]'),
        error.message
      );
    }
  });
}

// Sign In
const signInForm = document.querySelector(".sign-in-form");

if (signInForm) {
  const signInBtn =
    signInForm.querySelector('input[type="submit"], input[type="button"]') ||
    signInForm.querySelector(".btn");

  if (signInBtn) {
    signInBtn.addEventListener("click", async () => {
      const email = signInForm
        .querySelector('input[placeholder="Username"]')
        .value.trim();
      const password = signInForm.querySelector(
        'input[placeholder="Password"]'
      ).value;

      if (!validateSignIn(email, password, signInForm)) return;

      try {
        const user = await signIn(email, password);
        localStorage.setItem("userEmail", user.email);
        alert(`✅ Logged in successfully: ${user.email}`);
        signInForm.reset();
        window.location.href = "index.html";
      } catch (error) {
        const input = signInForm.querySelector('input[placeholder="Password"]');
        let msg = "Email or password is incorrect. Please try again";
        if (error.code === "auth/user-not-found")
          msg = "Email not found. Please sign up first";
        else if (error.code === "auth/wrong-password")
          msg = "Incorrect password. Please try again";
        showError(input, msg);
      }
    });
  }
}

// Switch panels
document.getElementById("sign-up-btn")?.addEventListener("click", () => {
  document.querySelector(".container")?.classList.add("sign-up-mode");
});
document.getElementById("sign-in-btn")?.addEventListener("click", () => {
  document.querySelector(".container")?.classList.remove("sign-up-mode");
});

// Show error
function showError(input, message) {
  let span = input.parentElement.querySelector(".error-msg");
  if (!span) {
    span = document.createElement("span");
    span.classList.add("error-msg");
    input.parentElement.appendChild(span);
  }
  span.textContent = message;
}

// Additional toggle buttons
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

if (sign_up_btn && container) {
  sign_up_btn.addEventListener("click", () =>
    container.classList.add("sign-up-mode")
  );
}

if (sign_in_btn && container) {
  sign_in_btn.addEventListener("click", () =>
    container.classList.remove("sign-up-mode")
  );
}
