export class Product {
  constructor({ id, title, price, description, category, image, rating }) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.category = category;
    this.image = image;
    this.rating = rating
      ? {
          rate: rating.rate,
          count: rating.count,
        }
      : null;
    this.sizes = {
      s: 0,
      m: 0,
      l: 0,
      xl: 0,
      xxl: 0,
    };
    this.quantity = Math.ceil(Math.random() * 10);
    if (this.description != "electronics") this.#distributeQuantity();
  }
  #distributeQuantity() {
    let keys = Object.keys(this.sizes);

    for (let i = 0; i < this.quantity; i++) {
      let randKey = keys[Math.floor(Math.random() * keys.length)];
      this.sizes[randKey]++;
    }
  }
}
Product.filterProducts = function (filterObj, products) {
  // debugger
  let filter = {
    sizes: [],
    categories: [],
    price: { start: 0, end: Infinity },
  };
  if (JSON.stringify(filter) === JSON.stringify(filterObj)) return products;

  return products.filter((prod) => {
    // Check category

    let isInRange =
      prod.price >= filterObj.price.start && prod.price <= filterObj.price.end;
    if (
      filterObj.categories.some((filterCat) =>
        prod.category.toLowerCase().includes(filterCat.toLowerCase())
      ) &&
      isInRange
    ) {
      return true;
    }

    // Check sizes
    if (filterObj.sizes.some((size) => prod.sizes[size] > 0) && isInRange) {
      return true;
    }

    // If nothing matches
    return false;
  });
};

Product.getFilterObject = function () {
  let filterObj = {};

  // Sizes
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const sizeChecks = sizes.map((element) =>
    document.getElementById(`size${element}`)
  );

  filterObj.sizes = Array.from(sizeChecks)
    .filter((chk) => chk.checked)
    .map((chk) => chk.value);

  //  Categories
  let catChecks = document.querySelectorAll(
    'input[type="checkbox"][id^="cat"]'
  );

  filterObj.categories = Array.from(catChecks)
    .filter((chk) => chk.checked)
    .map((chk) => chk.value);

  // Price (two inputs inside .from-to-price)
  let priceInputs = document.querySelectorAll(".from-to-price input");
  let start = priceInputs[0].value ? parseFloat(priceInputs[0].value) : 0;
  let end = priceInputs[1].value ? parseFloat(priceInputs[1].value) : Infinity;
  filterObj.price = { start, end };

  return filterObj;
};
