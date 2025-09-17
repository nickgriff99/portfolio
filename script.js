document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Portfolio: DOM Content Loaded - Initializing components");
  
  const mobileMenu = document.getElementById("mobile-menu");
  const navMenu = document.querySelector(".nav-menu");

  mobileMenu.addEventListener("click", function () {
    navMenu.classList.toggle("active");
    console.log("📱 Mobile menu toggled:", navMenu.classList.contains("active") ? "opened" : "closed");

    const bars = mobileMenu.querySelectorAll(".bar");
    bars.forEach((bar) => bar.classList.toggle("active"));
  });

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      const bars = mobileMenu.querySelectorAll(".bar");
      bars.forEach((bar) => bar.classList.remove("active"));
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        console.log("🎯 Navigation: Scrolling to section", targetId);
        const headerHeight = document.querySelector("header").offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      } else {
        console.warn("⚠️ Navigation: Target section not found", targetId);
      }
    });
  });

  let lastScrollTop = 0;
  const scrollThreshold = 5;

  window.addEventListener("scroll", function () {
    let current = "";
    const sections = document.querySelectorAll("section");
    const headerHeight = document.querySelector("header").offsetHeight;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - headerHeight - 200) {
        current = section.getAttribute("id");
      }
    });

    if (current) {
      console.log("📍 Active section:", current);
    }

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });

    const header = document.querySelector("header");
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (window.scrollY > 100) {
      header.style.backgroundColor = "rgba(255, 255, 255, 0.98)";
    } else {
      header.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
    }

    if (Math.abs(scrollTop - lastScrollTop) > scrollThreshold) {
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.classList.add("header-hidden");
      } else {
        header.classList.remove("header-hidden");
      }
      lastScrollTop = scrollTop;
    }

    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
      if (window.scrollY > 500) {
        backToTop.style.opacity = "1";
        backToTop.style.visibility = "visible";
      } else {
        backToTop.style.opacity = "0";
        backToTop.style.visibility = "hidden";
      }
    }
  });

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    console.log("📧 Contact form found - Initializing form handlers");
    let lastSubmissionTime = 0;
    const RATE_LIMIT_MS = 30000;

    contactForm.addEventListener("submit", function (e) {
      console.log("📝 Contact form submission attempted");
      const currentTime = Date.now();
      const timeSinceLastSubmission = currentTime - lastSubmissionTime;

      if (timeSinceLastSubmission < RATE_LIMIT_MS) {
        e.preventDefault();
        const remainingTime = Math.ceil(
          (RATE_LIMIT_MS - timeSinceLastSubmission) / 1000,
        );
        console.warn("⏰ Rate limit triggered:", remainingTime, "seconds remaining");
        showNotification(
          `Please wait ${remainingTime} seconds before sending another message.`,
          "error",
        );
        return;
      }

      const formData = new FormData(this);
      const name = formData.get("name");
      const email = formData.get("email");
      const subject = formData.get("subject");
      const message = formData.get("message");

      console.log("📋 Form data collected:", { name, email, subject, messageLength: message?.length });

      if (!name || !email || !subject || !message) {
        e.preventDefault();
        console.error("❌ Form validation failed: Missing required fields");
        showNotification("Please fill in all required fields.", "error");
        return;
      }

      if (!isValidEmail(email)) {
        e.preventDefault();
        console.error("❌ Form validation failed: Invalid email format");
        showNotification("Please enter a valid email address.", "error");
        return;
      }

      if (isSpamContent(name, email, subject, message)) {
        e.preventDefault();
        console.error("❌ Spam detection triggered");
        showNotification(
          "Message appears to be spam. Please write a genuine message.",
          "error",
        );
        return;
      }

      const submitBtn = document.getElementById("submitBtn");
      const btnText = submitBtn.querySelector(".btn-text");
      const btnLoading = submitBtn.querySelector(".btn-loading");

      if (submitBtn && btnText && btnLoading) {
        submitBtn.disabled = true;
        btnText.style.display = "none";
        btnLoading.style.display = "inline";
      }

      console.log("✅ Form validation passed - submitting to Netlify");
      lastSubmissionTime = currentTime;
    });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isSpamContent(name, email, subject, message) {
    const spamKeywords = [
      "viagra",
      "casino",
      "lottery",
      "winner",
      "congratulations",
      "million dollars",
      "click here",
      "free money",
      "urgent",
      "business proposal",
      "inheritance",
      "bitcoin",
      "cryptocurrency",
    ];

    const allText = `${name} ${email} ${subject} ${message}`.toLowerCase();

    for (const keyword of spamKeywords) {
      if (allText.includes(keyword)) {
        return true;
      }
    }

    const linkCount = (message.match(/http/gi) || []).length;
    if (linkCount > 2) {
      return true;
    }

    const repeatedChars = /(.)\1{5,}/;
    if (repeatedChars.test(allText)) {
      return true;
    }

    if (message.length > 20 && message === message.toUpperCase()) {
      return true;
    }

    return false;
  }

  function showNotification(message, type) {
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: ${type === "success" ? "#28a745" : "#dc3545"};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    setTimeout(() => {
      notification.style.transform = "translateX(400px)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 5000);
  }

  const observerOptions = {
    threshold: 0.001,
    rootMargin: "0px 0px 200px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      const isHeader = entry.target.matches(
        "h1, h2, h3, .hero-title, .section-title",
      );

      if (entry.isIntersecting) {
        const hasAnimatedBefore = entry.target.hasAttribute("data-animated");

        if (hasAnimatedBefore) {
          entry.target.classList.add("fast-animate");
        }

        entry.target.classList.add("animate-in");
        entry.target.classList.remove("animate-out");

        entry.target.setAttribute("data-animated", "true");

        if (isHeader) {
          setTimeout(() => {
            entry.target.classList.add("always-visible");
          }, 300); 
        }
      } else {
        if (!isHeader) {
          entry.target.classList.add("animate-out");
          entry.target.classList.remove("animate-in");
        }
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll(
    ".hero-title, .hero-subtitle, .hero-description, .hero-buttons, " +
      ".section-title, .about-description, .timeline-item, .project-card, " +
      ".skill-category, .contact-info, .contact-form, .profile-img",
  );

  animateElements.forEach((el, index) => {
    el.classList.add("viewport-animate");

    if (
      el.classList.contains("hero-title") ||
      el.classList.contains("hero-subtitle") ||
      el.classList.contains("hero-description") ||
      el.classList.contains("hero-buttons")
    ) {
      el.style.setProperty("--animation-delay", `${index * 0.1}s`);
    } else {
      el.style.setProperty("--animation-delay", `${index * 0.05}s`);
    }

    observer.observe(el);
  });

  const observeReactComponents = () => {
    const reactElements = document.querySelectorAll(
      ".react-project-card, .skill-badge, .carousel-card",
    );
    reactElements.forEach((el) => {
      if (!el.classList.contains("viewport-animate")) {
        el.classList.add("viewport-animate");
        observer.observe(el);
      }
    });

    const dynamicHeaders = document.querySelectorAll(
      "h1, h2, h3, .section-title, .hero-title",
    );
    dynamicHeaders.forEach((header) => {
      if (!header.classList.contains("viewport-animate")) {
        header.classList.add("viewport-animate");
        observer.observe(header);
      }
    });
  };

  setTimeout(observeReactComponents, 1000);
  setInterval(observeReactComponents, 3000);

  console.log("🔝 Creating back-to-top button");
  const backToTop = document.createElement("button");
  backToTop.innerHTML = "↑";
  backToTop.className = "back-to-top";
  backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    `;

  document.body.appendChild(backToTop);

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
