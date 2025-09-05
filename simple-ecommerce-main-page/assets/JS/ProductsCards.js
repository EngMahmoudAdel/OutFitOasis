export class ProductsCards {
  constructor() {
    this.productsContainer = document.getElementsByClassName("main-content")[0]; // container
    this.templateCard = document.getElementsByClassName("product-card")[0]; // template
    this.productsContainer.innerHTML = "";
    this.newCard = null;
  }

  create(product) {
    this.newCard = this.templateCard.cloneNode(true);

    this.#setName(product.title);
    this.#setImg(product.image);
    this.#setPrice(product.price);
    this.#setCategory(product.category);

    const viewBtn = this.newCard.querySelector(".btn-view");
    if (viewBtn) viewBtn.dataset.id = product.id;

    const cartBtn = this.newCard.querySelector(".btn-add-to-cart");
    if (cartBtn) cartBtn.dataset.id = product.id;

    return this;
  }

  #setName(myName) {
    this.newCard.querySelector("#name").innerText = myName;
    return this;
  }

  #setImg(url) {
    this.newCard.querySelector("img").src = url;
    return this;
  }

  #setPrice(price) {
    this.newCard.querySelector(".price").innerText = `$${price}`;
    return this;
  }

  #setCategory(category) {
    this.newCard.querySelector(".category").innerText = category;
    return this;
  }

  addCard() {
    this.productsContainer.appendChild(this.newCard); // add cloned card
    return this;
  }
}
