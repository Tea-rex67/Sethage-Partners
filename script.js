document.addEventListener("DOMContentLoaded", () => {

  // BOOKING SYSTEM FUNCTIONALITY
  if (document.querySelector('.booking-hero')) {
    const sections = document.querySelectorAll('.booking-section');
    const serviceCards = document.querySelectorAll('[data-service]');
    const nextBtns = document.querySelectorAll('.btn-next');
    const backBtns = document.querySelectorAll('.btn-back');
    const cancelBtn = document.querySelector('.btn-cancel');
    const confirmBtn = document.querySelector('.btn-confirm');
    const form = document.querySelector('.booking-form');
    const bookingData = {};

    // Service selection
    serviceCards.forEach(card => {
      card.addEventListener('click', () => {
        serviceCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        bookingData.service = card.dataset.service;
        bookingData.price = card.dataset.price;
        document.querySelector('.btn-next').disabled = false;
      });
    });

    // Next button
    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.querySelector('.booking-section.active');
        const nextSection = current.nextElementSibling;
        if (nextSection && nextSection.classList.contains('booking-section')) {
          current.classList.remove('active');
          nextSection.classList.add('active');
          if (bookingData.service) {
            updateSummary();
          }
        }
      });
    });

    // Back button
    backBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.querySelector('.booking-section.active');
        const prevSection = current.previousElementSibling;
        if (prevSection && prevSection.classList.contains('booking-section')) {
          current.classList.remove('active');
          prevSection.classList.add('active');
        }
      });
    });

    // Cancel
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (confirm('Cancel booking?')) {
          window.location.href = 'home.html';
        }
      });
    }

    // Confirm
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const formData = new FormData(form);
        bookingData.name = form.querySelector('input[type="text"]').value;
        bookingData.email = form.querySelector('input[type="email"]').value;
        bookingData.phone = form.querySelector('input[type="tel"]').value;
        bookingData.date = form.querySelector('input[type="date"]').value;
        bookingData.time = form.querySelector('input[type="text"]:nth-of-type(2)').value;
        bookingData.notes = form.querySelector('textarea').value;
        bookingData.payment = document.querySelector('input[name="payment"]:checked').value;

        localStorage.setItem('bookingData', JSON.stringify(bookingData));
        
        const confirmSection = document.querySelector('#confirm');
        confirmSection.querySelector('.confirm-summary').innerHTML = `
          <p><strong>Service:</strong> ${bookingData.service}</p>
          <p><strong>Price:</strong> $${bookingData.price}</p>
          <p><strong>Name:</strong> ${bookingData.name}</p>
          <p><strong>Email:</strong> ${bookingData.email}</p>
          <p><strong>Date/Time:</strong> ${bookingData.date} ${bookingData.time}</p>
          <p><strong>Payment:</strong> ${bookingData.payment}</p>
        `;
        
        const current = document.querySelector('.booking-section.active');
        current.classList.remove('active');
        confirmSection.classList.add('active');
      });
    }

    function updateSummary() {
      document.querySelector('.service-name').textContent = bookingData.service;
      document.querySelector('.service-price').textContent = `$${bookingData.price}`;
      document.querySelector('.total-price').textContent = `$${bookingData.price}`;
    }

    // Load previous data
    const saved = localStorage.getItem('bookingData');
    if (saved) {
      const data = JSON.parse(saved);
      const savedCard = document.querySelector(`[data-service="${data.service}"]`);
      if (savedCard) {
        savedCard.classList.add('selected');
        document.querySelector('.btn-next').disabled = false;
        bookingData.service = data.service;
        bookingData.price = data.price;
      }
    }
  }

  /* ============================
     MOBILE MENU
  ============================ */
  const hamburger = document.querySelector("#hamburger");
  const mobileMenu = document.querySelector("#mobileMenu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      mobileMenu.classList.toggle("active");
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("active");
      }
    });

    // Close when clicking a link
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("active");
      });
    });

    // Close menu on desktop resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("active");
      }
    });
  }

  /* ============================
     TESTIMONIAL SLIDER
  ============================ */
  const track = document.querySelector(".ts-track");
  const cards = document.querySelectorAll(".ts-card:not(.clone)");
  const prev = document.querySelector(".ts-prev");
  const next = document.querySelector(".ts-next");
  const dotsContainer = document.querySelector(".ts-dots");

  if (track && cards.length && prev && next && dotsContainer) {
    let index = 0;
    let autoSlide;

    function visibleSlides() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    function createDots() {
      dotsContainer.innerHTML = "";
      cards.forEach((_, i) => {
        const dot = document.createElement("span");
        if (i === 0) dot.classList.add("active");
        dotsContainer.appendChild(dot);

        dot.addEventListener("click", () => {
          index = i;
          moveSlider();
          restartAutoSlide();
        });
      });
    }

    function updateDots() {
      const dots = dotsContainer.querySelectorAll("span");
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
    }

    function moveSlider() {
      const visible = visibleSlides();
      const shift = index * (100 / visible);
      track.style.transform = `translateX(-${shift}%)`;
      updateDots();
    }

    next.addEventListener("click", () => {
      index++;
      if (index >= cards.length) index = 0;
      moveSlider();
      restartAutoSlide();
    });

    prev.addEventListener("click", () => {
      index--;
      if (index < 0) index = cards.length - 1;
      moveSlider();
      restartAutoSlide();
    });

    function startAutoSlide() {
      autoSlide = setInterval(() => {
        index++;
        if (index >= cards.length) index = 0;
        moveSlider();
      }, 5000);
    }

    function restartAutoSlide() {
      clearInterval(autoSlide);
      startAutoSlide();
    }

    window.addEventListener("resize", () => {
      moveSlider();
    });

    createDots();
    moveSlider();
    startAutoSlide();
  }

  /* ============================
     APPOINTMENT BUTTON SCROLL
  ============================ */
  const appointmentBtn = document.querySelector(".hero1-btn");
  const appointmentSection = document.querySelector(".hero1");

  if (appointmentBtn && appointmentSection) {
    appointmentBtn.addEventListener("click", (e) => {
      e.preventDefault();
      appointmentSection.scrollIntoView({ behavior: "smooth" });
    });
  }
});


  const faqs = document.querySelectorAll(".faq-item");

  faqs.forEach(faq => {
    faq.querySelector(".faq-question").addEventListener("click", () => {

      // Close others
      faqs.forEach(item => {
        if (item !== faq) item.classList.remove("active");
      });

      // Toggle current
      faq.classList.toggle("active");
    });
  });


  const faq = document.querySelectorAll(".faq-item");

  faqs.forEach(faq => {
    faq.querySelector(".faq-question").addEventListener("click", () => {
      faq.classList.toggle("active");
    });
  });


  const form = document.getElementById("appointmentForm");
  const formBlock = document.getElementById("formBlock");
  const successBlock = document.getElementById("successBlock");

  form.addEventListener("submit", function(e) {
    e.preventDefault(); // stop page reload

    formBlock.style.display = "none";      // hide form
    successBlock.style.display = "block";  // show success message
  });


  const overlay = document.getElementById("bookingOverlay");
  const modal = document.getElementById("bookingModal");

  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");

  const nextBtn = document.getElementById("nextBtn");

  const serviceItems = document.querySelectorAll(".service-item");
  const selectedService = document.getElementById("selectedService");
  const servicePrice = document.getElementById("servicePrice");
  const totalPrice = document.getElementById("totalPrice");

  let chosenService = null;
  let chosenPrice = 0;

  // Show modal on load
  window.onload = () => {
    overlay.classList.add("active");
    modal.classList.add("active");
    step1.classList.add("active");
  };

  // Select service
  serviceItems.forEach(item => {
    item.addEventListener("click", () => {
      serviceItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      chosenService = item.dataset.name;
      chosenPrice = item.dataset.price;

      selectedService.textContent = chosenService;
      servicePrice.textContent = chosenPrice;
      totalPrice.textContent = chosenPrice;
    });
  });

  // Next button
  nextBtn.addEventListener("click", () => {
    if (!chosenService) {
      alert("Please select a service first.");
      return;
    }

    step1.classList.remove("active");
    step2.classList.add("active");
  });


document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav_links");

  // 1. Detect current page and activate correct link
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  links.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    }
  });

  // 2. Change active link on click
  links.forEach(link => {
    link.addEventListener("click", () => {
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });
});

