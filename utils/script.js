const toggleBtn = document.getElementById("dark-mode");
const toggleIcon = toggleBtn.querySelector("i");
const toggleText = toggleBtn.querySelector("span");
const filter = document.getElementById("Filter");
const countryList = document.getElementById("country-list");

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    toggleIcon.className = "fa-solid fa-sun";
    toggleText.textContent = "Light Mode";
  }
  loadCountries();
});

function createCountryCard(country) {
  const lang = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";

  return `
    <div class="country-card" data-code="${country.cca3}">
      <img src="${country.flags.png}" alt="${
    country.name.common
  } flag" class="country-flag" />

      <div class="country-info">
        <h3 class="country-name">${country.name.common}</h3>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Capital:</strong> ${
          country.capital ? country.capital[0] : "N/A"
        }</p>
        <p><strong>Languages:</strong> ${lang}</p>
      </div>
    </div>
  `;
}

async function loadCountries() {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags,languages"
  );
  const data = await res.json();

  data.forEach((country) => {
    countryList.innerHTML += createCountryCard(country);
  });
}

toggleBtn.addEventListener("click", () => {
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
