// ===============================
// GLOBAL.JS (MATCHED TO YOUR HTML)
// ===============================


// -------------------------------
// MOBILE NAV TOGGLE
// -------------------------------
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", mainNav.classList.contains("nav-open"));
  });
}


// -------------------------------
// CLOSE NAV ON LINK CLICK (MOBILE)
// -------------------------------
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    if (mainNav.classList.contains("nav-open")) {
      mainNav.classList.remove("nav-open");
    }
  });
});


// -------------------------------
// ACTIVE LINK BASED ON PAGE
// -------------------------------
const currentPage = window.location.pathname.split("/").pop();

navLinks.forEach(link => {
  const linkPage = link.getAttribute("href");

  if (linkPage === currentPage) {
    link.classList.add("active");
  }
});


// -------------------------------
// DARK MODE TOGGLE
// -------------------------------
const themeToggle = document.getElementById("themeToggle");

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
}