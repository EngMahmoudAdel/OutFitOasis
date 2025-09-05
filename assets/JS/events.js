import { Product } from "./product.js";
import { returnProductsToBeFiltered } from "./main.js";
import { ProductsCards } from "./ProductsCards.js";
export class Events {
  constructor() {
    this.filterationContainer =
      document.getElementsByClassName("filter-list")[0];
    this.filterBtn = document.getElementsByClassName("filter-btn")[0];
    this.collapseFilter = document.getElementsByClassName("collapse-filter")[0];
    this.applyFilter = document.getElementsByClassName("apply-filter")[0];
    this.shopNow = document.getElementsByClassName("shop-now")[0];
    console.log(this.shopNow);
    this.nav = document.getElementsByClassName("main-nav")[0];
    this.backToTop = document.getElementById("backToTop");
    this.#setEvents();
  }

  #showFilterCollabse() {
    this.filterationContainer.classList.toggle("open");
  }

  #setEvents() {
    this.shopNow.addEventListener("click", () => {
      console.log("clicked");

      const nav = this.nav;

      // Save original content and background
      const originalContent = nav.innerHTML;
      const originalBackground = nav.style.backgroundColor;

      // Set nav height to prevent collapse
      const height = nav.offsetHeight + "px";
      nav.style.height = height;

      // Make it flex and center content
      nav.style.display = "flex";
      nav.style.justifyContent = "center";
      nav.style.alignItems = "center";
      nav.style = "background-color:#000 !important";
      nav.style.transition = "background-color 0.5s ease";

      // Restore after 2 seconds
      setTimeout(() => {
        nav.innerHTML = originalContent;
        nav.style.backgroundColor = originalBackground;
        nav.style.display = "";
        nav.style.justifyContent = "";
        nav.style.alignItems = "";
        nav.style.height = "";
      }, 2000);
    });

    this.filterBtn.addEventListener("click", () => this.#showFilterCollabse());
    this.collapseFilter.addEventListener("click", () =>
      this.#showFilterCollabse()
    );

    this.applyFilter.addEventListener("click", () => {
      var products = [];
      returnProductsToBeFiltered().forEach((element) => {
        let product = new Product(element);
        products.push(product);
      });

      var filterdProducts = Product.filterProducts(
        Product.getFilterObject(),
        products
      );

      var productsCards = new ProductsCards();
      filterdProducts.forEach((element) => {
        productsCards.create(element);
        productsCards.addCard();
      });
    });
    window.addEventListener("scroll", () => {
      this.backToTop.display = window.scrollY >= 300 ? "fixed" : "none";
    });

    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        this.backToTop.style.display = "block";
      } else {
        this.backToTop.style.display = "none";
      }
    });

    // Scroll to top smoothly when clicked
    this.backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}
