const toggleBtn = document.getElementById("dark-mode");
const toggleIcon = toggleBtn.querySelector("i");
const toggleText = toggleBtn.querySelector("span");
const filter = document.getElementById("Filter");
const countryList = document.getElementById("country-list");
const searchInput = document.getElementById("search");

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
  } flag" class="country-flag" aria-label="${country.name.common} flag"/>

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

function countryPage() {
  document.querySelectorAll(".country-card").forEach((card) => {
    card.addEventListener("click", () => {
      const code = card.getAttribute("data-code");
      window.location.href = `country.html?code=${code}`;
    });
  });
}

async function loadCountries() {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags,languages,cca3"
  );
  allCountries = await res.json();
  displayCountries(allCountries);
}

function displayCountries(list) {
  if (list.length === 0) {
    countryList.innerHTML = `
      <div class="no-results">
        <i class="fa-regular fa-face-frown" style="font-size:3rem; display:block; margin-bottom:1rem;"></i>
        Unfortunately, there were no countries matching that name.
      </div>
    `;
    return;
  }

  countryList.innerHTML = list.map(createCountryCard).join("");
  countryPage();
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  const filtered = allCountries.filter((country) =>
    country.name.common.toLowerCase().includes(query)
  );

  displayCountries(filtered);
});

filter.addEventListener("change", () => {
  const region = filter.value;

  if (region === "all") {
    displayCountries(allCountries);
    return;
  }

  const filtered = allCountries.filter(
    (country) => country.region.toLowerCase() === region.toLowerCase()
  );

  displayCountries(filtered);
});

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
