const toggle = document.getElementById("dark-mode");
const Details = document.getElementById("country-detail");
const toggleText = document.querySelector("span");
const toggleIcon = document.querySelector("i");
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("theme");

  if (saved === "dark") {
    document.body.classList.add("dark-theme");
    toggleIcon.className = "fa-solid fa-sun";
    toggleText.textContent = "Light Mode";
  }

  loadCountry();
});

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  const isDark = document.body.classList.contains("dark-theme");

  if (isDark) {
    toggleIcon.className = "fa-solid fa-sun";
    toggleText.textContent = "Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    toggleIcon.className = "fa-regular fa-moon";
    toggleText.textContent = "Dark Mode";
    localStorage.setItem("theme", "light");
  }
});
