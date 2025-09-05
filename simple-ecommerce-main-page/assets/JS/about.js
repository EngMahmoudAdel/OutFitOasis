export class Slider {
  constructor(containerSelector, autoSlide = true, interval = 3000) {
    this.container = document.querySelector(containerSelector);
    this.slider = this.container.querySelector(".slider");
    this.slides = this.container.querySelectorAll(".slide");
    this.prevBtn = this.container.querySelector(".prev");
    this.nextBtn = this.container.querySelector(".next");
    this.dots = this.container.querySelectorAll(".dot");
    this.currentIndex = 0;
    this.autoSlide = autoSlide;
    this.intervalTime = interval;
    this.timer = null;

    this.#init();
  }

  #init() {
    this.updateSliderPosition();
    this.prevBtn.addEventListener("click", () => this.prevSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());

    this.dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        this.currentIndex = i;
        this.updateSliderPosition();
      });
    });

    if (this.autoSlide) {
      this.startAutoSlide();
      this.container.addEventListener("mouseenter", () =>
        clearInterval(this.timer)
      );
      this.container.addEventListener("mouseleave", () =>
        this.startAutoSlide()
      );
    }
  }

  startAutoSlide() {
    this.timer = setInterval(() => this.nextSlide(), this.intervalTime);
  }

  updateSliderPosition() {
    const offset = -this.currentIndex * 100;
    this.slider.style.transform = `translateX(${offset}%)`;
    this.dots.forEach((dot) => dot.classList.remove("active"));
    this.dots[this.currentIndex].classList.add("active");
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSliderPosition();
  }

  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSliderPosition();
  }
}
